const express = require('express');
const cors = require('cors');
const User = require('./models/User')
const mongoose = require('mongoose');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10); //to encrypt password
const jwt = require('jsonwebtoken')
const fs  = require('fs');
const secretKey = "hjkghakjdh";
const cookieParser = require('cookie-parser');
const multer = require('multer')
const uploadMiddleware = multer({dest:'uploads/'});
const app = express();
app.use(cookieParser());
app.use(cors({credentials:true, origin:"http://localhost:3000"}));
app.use(express.json());
app.use('/uploads', express.static(__dirname+'/uploads'))

async function connectTodb(){
    try{
        await mongoose.connect('mongodb+srv://tempodummy12:O6YzOhaFTn0qPOZC@cluster0.fou8jog.mongodb.net/?retryWrites=true');
        console.log("connected to mongodb");
    }catch(error){
        console.log("error connecting to mongodb", error);
    }
}

connectTodb();

app.post('/register', async (req, res)=>{
    const {username, password} = req.body;
   try{ 
    const userDoc = await User.create({username, password: bcrypt.hashSync(password, salt)});
    res.json(userDoc)
}catch(e){
    res.status(400).json(e);
}
});

app.post('/login', async (req, res)=>{
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passok = bcrypt.compareSync(password, userDoc.password);  
    console.log("passok")
    if(passok){
      jwt.sign({username, id: userDoc._id}, secretKey, {}, (err, token)=>{
        if(err)throw err;
        res.cookie('token', token).json({
            id: userDoc._id,
            username,
        });
      });
    }else{
       res.status(400).json("Wrong credentials");
    }
})

app.get('/profile', (req, res)=>{
    const {token} = req.cookies;
    jwt.verify(token, secretKey, {}, (err, info)=>{
        if(err)throw err;
        res.json(info);
    });
})



app.post('/logout', (req, res)=>{
    res.cookie('token', '').json("OK");
})

app.post('/post',uploadMiddleware.single('file'), async(req, res)=>{
    const{originalname , path} = req.file;
    const parts = originalname.split('.');
    const extension = parts[parts.length-1];
    const newPath = path+'.'+extension;
    fs.renameSync(path, newPath);

    //catch token from cookie to get the user id
    const {token} = req.cookies;
    jwt.verify(token, secretKey, {}, async(err, info)=>{
        if(err)throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title, 
            summary, 
            content,
            cover:newPath,
            author:info.id, 
        });
    
        res.json(postDoc);
    });


   
})

app.get('/post', async(req, res)=>{
    res.json(await Post.find()
    .populate('author', ['username'])
    .sort({createdAt:-1})
    .limit(20));
})

app.put('/post', uploadMiddleware.single('file'), async(req, res)=>{
    let newPath = null;
    if(req.file){
    const{originalname , path} = req.file;
    const parts = originalname.split('.');
    const extension = parts[parts.length-1];
    newPath = path+'.'+extension;
    fs.renameSync(path, newPath);
    }
    
    const {token} = req.cookies;
    jwt.verify(token, secretKey, {}, async(err, info)=>{
        if(err)throw err;
        const {id,title, summary, content} = req.body;
        const postDoc = await Post.findById(id);

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

        if(!isAuthor){
        return res.status(400).json("you are not author");
            
        }
        
       await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);  
    });

})
app.get('/post/:id', async(req, res)=>{
    const {id} = req.params;
    const PostDoc = await Post.findById(id).populate('author', ['username']);
    res.json(PostDoc);
})
app.listen(4000, ()=>{
    console.log("listening on port 4000");
});
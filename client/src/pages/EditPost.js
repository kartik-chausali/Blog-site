import {useEffect, useState} from 'react'
import {Navigate, useParams} from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/react-quill'


const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const format = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];


export default function EditPost(){
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content , setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect , setRedirect] = useState(false);

    useEffect(()=>{
        fetch('http://localhost:4000/post/'+id)
        .then(response =>{
            response.json().then(postInfo =>{
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
            })
        })
    }, []);


    async function updatePost(ev){
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]){
            data.set('file', files?.[0]); 
        }
        
        const response = await fetch('http://localhost:4000/post', {
            method:'PUT',
            body:data,
            credentials:'include',
        })

        if(response.ok){
            setRedirect(true);
        }
        
    }

    if(redirect){
        return <Navigate to={'/post/'+id} />
      }
      return (
      <form onSubmit={updatePost}>
          <input type="title" placeholder="tittle" value={title} onChange={e=>setTitle(e.target.value)}></input>
          <input type="summary" placeholder="summary" value={summary} onChange={e=>setSummary(e.target.value)}></input>
          <input type='file' onChange={e=>setFiles(e.target.files)}/>
          <ReactQuill value={content} modules={modules} formats={format} onChange={newValue=> setContent(newValue)} />
          <button style={{marginTop:'5px'}}>Update Post</button>
      </form>
          
      )
}
import ReactQuill from 'react-quill'
import 'react-quill/dist/react-quill'
import {useState} from 'react'
import { Navigate} from 'react-router-dom';

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


export default function CreatePost(){

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content , setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect , setRedirect] = useState(false);

    async function createNewPost(e){
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);  //bcoz we want to send only one file at indx 0 even if user selects multiple files
        const response = await fetch('http://localhost:4000/post', {
            method:"POST",
            body:data,
            credentials:'include',
        });
        if(response.ok){
            setRedirect(true);
        }
    }
    if(redirect){
      return <Navigate to={'/'} />
    }
    return (
    <form onSubmit={createNewPost}>
        <input type="title" placeholder="tittle" value={title} onChange={e=>setTitle(e.target.value)}></input>
        <input type="summary" placeholder="summary" value={summary} onChange={e=>setSummary(e.target.value)}></input>
        <input type='file' onChange={e=>setFiles(e.target.files)}/>
        <ReactQuill value={content} modules={modules} formats={format} onChange={newValue=> setContent(newValue)} />
        <button style={{marginTop:'5px'}}>Create Post</button>
    </form>
        
    )
}
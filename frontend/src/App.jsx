import { useState, useEffect } from 'react'
import Recipe from './Recipe.jsx'
import Search from './Search.jsx'
import Post from './Post.jsx'


function App() {
  const [post, setPost]=useState(false);

  return (
    <div className="screen">
      <div className="page">
        {!post && 
        (
          <>
            <Search/>
            <Recipe/>
          </>
        )}
        {post && <Post/>}
      </div>
      <div className="header-right">
        <i className="fa-solid fa-plus" onClick={()=>setPost(true)}></i>
    </div>
    </div>
  )
}

export default App

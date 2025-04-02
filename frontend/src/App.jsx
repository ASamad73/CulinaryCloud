import { useState, useEffect } from 'react'
import Recipe from './Recipe.jsx'
import Search from './Search.jsx'
import Navbar from './Navbar.jsx'
import Post from './Post.jsx'

function App() {
  const [post, setPost]=useState(false);

  return (
    <div className="screen">
      <div className='page'>
        <div className="left-part">
          <Navbar
            setPost={setPost}
          />
        </div>
        <div className="middle-part">
          {!post ? (
            <>
              <Search />
              <Recipe />
            </>
          ) : (
            <Post />
          )}
        </div>
      </div>
    </div>
  )
}

export default App

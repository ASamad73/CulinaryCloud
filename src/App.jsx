import { useState, useEffect } from 'react'
import Recipe from './Recipe.jsx'
import Search from './Search.jsx'

function App() {

  return (
    <div className="page">
      <Search/>
      <Recipe/>
    </div>
  )
}

export default App

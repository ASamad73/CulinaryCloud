import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar(props) {
  const navigate=useNavigate();

  return (
    <div className="navbar">
      <h2 className="navbar-name">CulinaryCloud</h2>
      <div className="sites-container">
        <div className="sites" onClick={() => {
          props.setPost(false);
          props.setProfile(false); // Reset profile when clicking "Home"
        }}>
          <i className="fa-solid fa-house"></i>
          <h3>Home</h3>
        </div>
        <div className="sites" onClick={()=>navigate("/quick-recipes")}>
          <i className="fa-solid fa-forward-fast"></i>
          <h3>Quick</h3>
        </div>
        <div className="sites" onClick={() => props.setPost(true)}>
          <i className="fa-solid fa-square-plus"></i>
          <h3>Create</h3>
        </div>
        <div className="sites" onClick={() => {
          props.setProfile(true);
          props.setPost(false); // Reset post when clicking "Profile"
        }}>
          <i className="fa-solid fa-user"></i>
          <h3>Profile</h3>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
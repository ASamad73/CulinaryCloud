import { useState } from "react"; 
import profile_img from "./assets/profile_img.png";
import post1 from "./assets/food1.jpg";
import post2 from "./assets/food2.jpeg";

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-top">
        <div className="profile-left">
          <img src={profile_img} alt="user_image" className="user-image" />
          <p className="user-bio">User Bio</p>
        </div>
        <div className="profile-right">
          <p>Username</p>
          <p>User's Badge</p>
          <button className="edit-profile">Edit Profile</button>
        </div>
      </div>
      <div className="profile-bottom">
        <h2 className="post-heading">
          Posts <i className="fa-solid fa-image"></i>
        </h2>
        <div className="user-posts">
          <img src={post1} alt="user post" className="user-recipe-posts" />
          <img src={post2} alt="user post" className="user-recipe-posts" />
        </div>
      </div>
    </div>
  );
}

export default Profile;
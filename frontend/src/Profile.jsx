// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import profile_img from "./assets/profile_img.png";
// import post1 from "./assets/food1.jpg";
// import post2 from "./assets/food2.jpeg";

// function Profile() {
//   const [userData, setUserData] = useState({
//     id: null,
//     profilePicture: "",
//     username: "Username",
//     bio: "User Bio"
//   });
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/user/me`,
//           {
//             headers: { "x-auth-token": token }
//           }
//         );
        
//         setUserData(prev => ({
//           ...prev,
//           id: response.data.id,
//           profilePicture: response.data.profilePicture || profile_img,
//           username: response.data.email || "Username to be Displayed here",
//           bio: response.data.bio || "No bio yet."
//         }));
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type and size
//     if (!file.type.match('image.*')) {
//       alert('Please select an image file');
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       alert('File size must be less than 10MB');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);
    
//     try {
//       const formData = new FormData();
//       formData.append('profilePicture', file);

//       const response = await axios.put(
//         `${import.meta.env.VITE_API_URL}/user/profile`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'x-auth-token': localStorage.getItem('token')
//           },
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percentCompleted);
//           }
//         }
//       );

//       setUserData(prev => ({
//         ...prev,
//         id: response.data.id,
//         profilePicture: response.data.profilePicture || profile_img,
//         username: response.data.name || "Username",
//         bio: response.data.bio || "No bio yet."
//       }));
      
//       alert('Profile picture updated successfully!');
//     } catch (error) {
//       console.error('Upload failed:', error);
//       alert(error.response?.data?.error || 'Upload failed');
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-container">
//       <div className="profile-top">
//         <div className="profile-left">
//           <div className="avatar-container">
//             <img 
//               src={userData.profilePicture} 
//               alt="Profile" 
//               className="profile-avatar"
//               onError={(e) => {
//                 e.target.src = profile_img;
//               }}
//             />
//             <div className="upload-controls">
//               <input
//                 type="file"
//                 id="profile-upload"
//                 accept="image/*"
//                 onChange={handleFileUpload}
//                 disabled={uploading}
//               />
//               <label htmlFor="profile-upload" className={`upload-btn ${uploading ? 'uploading' : ''}`}>
//                 {uploading ? `Uploading... ${uploadProgress}%` : 'Change Photo'}
//               </label>
//               {uploading && (
//                 <div className="progress-bar">
//                   <div 
//                     className="progress" 
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <p className="user-bio">{userData.bio}</p>
//         </div>

//         <div className="profile-right">
//           <h2 className="username">{userData.username}</h2>
//           <span className="badge">Premium Member</span>
//           <button className="edit-profile-btn">
//             Edit Profile
//           </button>
//         </div>
//       </div>

//       <div className="profile-posts">
//         <h3>
//           <i className="icon-photo"></i> My Recipes
//         </h3>
//         <div className="posts-grid">
//           <img src={post1} alt="My recipe" />
//           <img src={post2} alt="My recipe" />
//         </div>
//       </div>

//       <style jsx>{`
//         .profile-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 2rem;
//           font-family: 'Segoe UI', sans-serif;
//         }
        
//         .profile-top {
//           display: flex;
//           gap: 3rem;
//           margin-bottom: 3rem;
//         }
        
//         .profile-left {
//           flex: 0 0 300px;
//         }
        
//         .avatar-container {
//           position: relative;
//           margin-bottom: 1.5rem;
//         }
        
//         .profile-avatar {
//           width: 200px;
//           height: 200px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 5px solid #f8f9fa;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         }
        
//         .upload-controls {
//           margin-top: 1rem;
//         }
        
//         #profile-upload {
//           display: none;
//         }
        
//         .upload-btn {
//           display: inline-block;
//           background: #3f51b5;
//           color: white;
//           padding: 0.8rem 1.5rem;
//           border-radius: 50px;
//           cursor: pointer;
//           font-weight: 500;
//           transition: all 0.3s ease;
//           text-align: center;
//           box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//         }
        
//         .upload-btn:hover {
//           background: #303f9f;
//           transform: translateY(-2px);
//         }
        
//         .upload-btn.uploading {
//           background: #757de8;
//         }
        
//         .progress-bar {
//           width: 100%;
//           height: 6px;
//           background: #e0e0e0;
//           border-radius: 3px;
//           margin-top: 0.5rem;
//           overflow: hidden;
//         }
        
//         .progress {
//           height: 100%;
//           background: #4caf50;
//           transition: width 0.3s ease;
//         }
        
//         /* Add more styles as needed */
//       `}</style>
//     </div>
//   );
// }

// export default Profile;
import React, { useState, useEffect } from "react";
import axios from "axios";
import profile_img from "./assets/profile_img.png";
import post1 from "./assets/food1.jpg";
import post2 from "./assets/food2.jpeg";

function Profile() {
  const [userData, setUserData] = useState({
    id: null,
    profilePicture: "",
    username: "Username",
    bio: "User Bio"
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/me`,
          {
            headers: { "x-auth-token": token }
          }
        );
        
        setUserData(prev => ({
          ...prev,
          id: response.data.id,
          profilePicture: response.data.profilePicture || profile_img,
          username: response.data.email || "Username to be Displayed here",
          bio: response.data.bio || "No bio yet."
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': localStorage.getItem('token')
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      setUserData(prev => ({
        ...prev,
        id: response.data.id,
        profilePicture: response.data.profilePicture || profile_img,
        username: response.data.name || "Username",
        bio: response.data.bio || "No bio yet."
      }));
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-top">
        <div className="profile-left">
          <img
            src={userData.profilePicture}
            alt="user_image"
            className="user-image"
            onError={(e) => {
              e.target.src = profile_img;
            }}
          />
          <p className="user-bio">{userData.bio}</p>
        </div>
        <div className="profile-right">
          <p>{userData.username}</p>
          <p>User's Badge</p>
          {/* Hidden file input for uploading profile picture */}
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          {/* Label styled as button triggers the file input */}
          <label htmlFor="profile-upload" className="edit-profile">
            {uploading ? `Uploading... ${uploadProgress}%` : 'Change Photo'}
          </label>
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

/* <style jsx>{`
  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .profile-top {
    display: flex;
    gap: 3rem;
    margin-bottom: 3rem;
  }
  
  .profile-left {
    flex: 0 0 300px;
  }
  
  .avatar-container {
    position: relative;
    margin-bottom: 1.5rem;
  }
  
  .profile-avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #f8f9fa;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .upload-controls {
    margin-top: 1rem;
  }
  
  #profile-upload {
    display: none;
  }
  
  .upload-btn {
    display: inline-block;
    background: #3f51b5;
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .upload-btn:hover {
    background: #303f9f;
    transform: translateY(-2px);
  }
  
  .upload-btn.uploading {
    background: #757de8;
  }
  
  .progress-bar {
    width: 100%;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    margin-top: 0.5rem;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background: #4caf50;
    transition: width 0.3s ease;
  }
  
  /* Add more styles as needed */
// `}</style> */}
// export default Profile;
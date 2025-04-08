import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post'; // for the expanded view

function Recipe() {
  const [recipes, setRecipes] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({}); // to track like toggles
  const [stars, setStars] = useState({}); // to track individual ratings

  const regular = "fa-regular fa-star";
  const solid = "fa-solid fa-star";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/recipes`, {
          headers: {
            'x-auth-token': token || '',
          },
        });
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    fetchRecipes();
  }, []);

  const handleLikeToggle = (id) => {
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleStarClick = (id, index) => {
    setStars(prev => ({
      ...prev,
      [id]: (index + 1 === prev[id] ? index : index + 1)
    }));
  };

  return (
    <>
      {recipes.map((recipe) => (
        <div className="post_container" key={recipe._id}>
          <div className="user_profile">     
            <i className="fa-solid fa-user" />
            <div className="user_info">
              <h4 id="user_name">{recipe.user?.username || "Unknown"}</h4>
              <h4 id="user_badge">Culinary Creator</h4>
            </div>
          </div>

          <img 
            src={recipe.image || '/default.jpg'} 
            alt="Food" 
            className="recipe-image" 
          />

          <div className="post_interations">
            <div className="like_comment">
              <i 
                className={likes[recipe._id] ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                onClick={() => handleLikeToggle(recipe._id)} 
              />
              <i className="fa-regular fa-comment" />
            </div>
            <div className="ratings">
              {[...Array(5)].map((_, index) => (
                <i 
                  key={index} 
                  className={index < (stars[recipe._id] || 0) ? solid : regular} 
                  onClick={() => handleStarClick(recipe._id, index)} 
                />
              ))}
            </div>
          </div>

          <div className="post-number">
            <p><b>{likes[recipe._id] ? recipe.likeCount + 1 : recipe.likeCount} {recipe.likeCount === 1 ? "like" : "likes"}</b></p>
            <p><b>{(stars[recipe._id] || 0)}.0 rated</b></p>
          </div>

          <p className="post-description">
            <b>{recipe.title}</b> {recipe.caption?.slice(0, 100)}...
            {!selectedPost || selectedPost._id !== recipe._id ? (
              <button className="learn-more" onClick={() => setSelectedPost(recipe)}>
                Learn More
              </button>
            ) : null}
          </p>
        </div>
      ))}

      {selectedPost && <Post recipe={selectedPost} />}
    </>
  );
}

export default Recipe;

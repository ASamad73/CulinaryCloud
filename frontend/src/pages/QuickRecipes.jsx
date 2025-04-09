import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuickRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${import.meta.env.VITE_API_URL}/recipes/quick`, {
      headers: { 'x-auth-token': token || '' }
    })
    .then(response => setRecipes(response.data))
    .catch(err => console.error("Error fetching quick recipes:", err));
  }, []);

  return (
    <div className="quick-recipes-page">
      <h2>Quick Recipes (Under 30 Minutes)</h2>
      {recipes.length ? recipes.map(recipe => (
        <div key={recipe._id} className="post_container" style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          {/* User details */}
          <div className="user_profile">
            <i className="fa-solid fa-user" />
            <div className="user_info">
              <h4>{recipe.user && recipe.user.username ? recipe.user.username : "Unknown"}</h4>
              <h4>Culinary Creator</h4>
            </div>
          </div>

          {/* Recipe image */}
          {recipe.image && (
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
          )}

          {/* Post interactions (icons can be made clickable as needed) */}
          <div className="post_interations">
            <div className="like_comment">
              <i className="fa-regular fa-heart" />
              <i className="fa-regular fa-comment" />
            </div>
            <div className="ratings">
              {/* Dummy ratings icons. You can enhance this with actual ratings logic */}
              {[...Array(5)].map((_, index) => (
                <i key={index} className="fa-solid fa-star" />
              ))}
            </div>
          </div>

          {/* Likes and comments counts */}
          <div className="post-number">
            <p><b>{recipe.likeCount || 0} {recipe.likeCount === 1 ? "like" : "likes"}</b></p>
            <p><b>{recipe.commentCount || 0} {recipe.commentCount === 1 ? "comment" : "comments"}</b></p>
          </div>

          {/* Title and Caption */}
          <p className="post-description">
            <b>{recipe.title}</b> - {recipe.caption}
          </p>

          {/* Detailed recipe information */}
          <div className="recipe-details">
            <p><strong>Total Time:</strong> {recipe.totalTime} minutes</p>
            {recipe.categories && recipe.categories.length > 0 && (
              <p><strong>Categories:</strong> {recipe.categories.join(', ')}</p>
            )}
            {recipe.steps && recipe.steps.length > 0 && (
              <div className="steps">
                <h4>Steps:</h4>
                {recipe.steps.map((step, index) => (
                  <div key={index} style={{ marginTop: "10px" }}>
                    <p><strong>Step {index + 1}:</strong> {step.description}</p>
                    {step.ingredients && (
                      <p>
                        <strong>Ingredients:</strong> {step.ingredients.join(', ')}
                      </p>
                    )}
                    {step.time && (
                      <p>
                        <strong>Time:</strong> {step.time.hours || 0} hours {step.time.minutes || 0} minutes
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Created date */}
          <p><small>Created on: {new Date(recipe.createdAt).toLocaleString()}</small></p>
        </div>
      )) : (
        <p>No quick recipes found.</p>
      )}
    </div>
  );
}

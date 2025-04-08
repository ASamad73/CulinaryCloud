// src/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function SearchResults() {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  // Parse the query parameters (using URLSearchParams)
  const queryParams = new URLSearchParams(location.search);
  const recipeId = queryParams.get('recipeId'); // if a specific recipe is selected
  const ingredient = queryParams.get('ingredient'); // ingredient filter
  const cuisine = queryParams.get('cuisine');       // cuisine filter

  useEffect(() => {
    // Build the API endpoint URL based on query parameters.
    const url = recipeId 
      ? `http://localhost:5001/api/recipes/${recipeId}`
      : `http://localhost:5001/api/recipes/search?` +
        (ingredient ? `ingredient=${encodeURIComponent(ingredient)}&` : '') +
        (cuisine ? `cuisine=${encodeURIComponent(cuisine)}` : '');
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // If fetching a single recipe, wrap it in an array for consistency.
        setRecipes(Array.isArray(data) ? data : [data]);
      })
      .catch((err) => console.error('Error fetching search results:', err));
  }, [recipeId, ingredient, cuisine]);

  return (
    <div>
      <h2>Search Results</h2>
      {recipes && recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div 
            key={recipe._id} 
            style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
          >
            <h3>{recipe.title}</h3>
            <p>{recipe.caption}</p>
            {recipe.image && (
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                style={{ width: '200px' }} 
              />
            )}
            <p><strong>Categories:</strong> {recipe.categories.join(', ')}</p>
            <div>
              <strong>Steps:</strong>
              {recipe.steps && recipe.steps.map((step, index) => (
                <div key={index} style={{ marginTop: '10px' }}>
                  <p><strong>Step {index + 1}:</strong> {step.description}</p>
                  {step.ingredients && (
                    <p><strong>Ingredients:</strong> {step.ingredients.join(', ')}</p>
                  )}
                  {step.time && (
                    <p>
                      <strong>Time:</strong> {step.time.hours} hours {step.time.minutes} minutes
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p>
              <strong>Likes:</strong> {recipe.likeCount} | <strong>Comments:</strong> {recipe.commentCount}
            </p>
            <p><small>Created on: {new Date(recipe.createdAt).toLocaleString()}</small></p>
          </div>
        ))
      ) : (
        <p>No recipes found</p>
      )}
    </div>
  );
}

export default SearchResults;
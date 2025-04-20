import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Post from './Post';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const recipeId = queryParams.get('recipeId');
  const ingredient = queryParams.get('ingredient');
  const cuisine = queryParams.get('cuisine');

  useEffect(() => {
    const url = recipeId
      ? `${import.meta.env.VITE_API_URL}/recipes/${recipeId}`
      : `${import.meta.env.VITE_API_URL}/recipes/search?` +
        (ingredient ? `ingredient=${encodeURIComponent(ingredient)}&` : '') +
        (cuisine ? `cuisine=${encodeURIComponent(cuisine)}` : '');

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setRecipes(Array.isArray(data) ? data : [data]);
      })
      .catch(err => console.error('Error fetching search results:', err));
  }, [recipeId, ingredient, cuisine]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="original-page">
      <div className="screen">
        <div className="page">
          <div className="left-part">
            <Navbar setPost={() => {}} setProfile={() => {}} setQuick={() => {}} />
          </div>
          <div className="middle-part">
            <h2>Search Results</h2>
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <div key={recipe._id}>
                  <div className="post_container">
                    <div className="user_profile">
                    {recipe.user?.profilePicture ? (
                        <img
                          src={recipe.user.profilePicture}
                          alt={recipe.user.name || "Profile"}
                          className="profile-pic"
                        />
                      ) : (
                        <i className="fa-solid fa-user" />
                      )}
                      <div className="user_info">
                        <h4>{recipe.user?.name || 'Unknown'}</h4>
                        <h4 id="user_badge">{recipe.user?.rank || "Prep Cook"}</h4>
                      </div>
                    </div>

                    <img
                      src={recipe.image || '/default.jpg'}
                      alt={recipe.title}
                      className="recipe-image"
                    />

                    <div className="post-number">
                      <p><b>{recipe.likeCount || 0} likes</b></p>
                      <p><b>{recipe.commentCount || 0} comments</b></p>
                    </div>

                    <p className="post-description">
                      <b>{recipe.title}</b> {recipe.caption?.slice(0, 100)}...
                      <button
                        className="learn-more"
                        onClick={() =>
                          setSelectedPost(
                            selectedPost?._id === recipe._id ? null : recipe
                          )
                        }
                      >
                        {selectedPost?._id === recipe._id ? 'Go Back' : 'Learn More'}
                      </button>
                    </p>
                  </div>

                  {selectedPost?._id === recipe._id && (
                    <div className="expanded-post">
                      <Post recipe={selectedPost} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
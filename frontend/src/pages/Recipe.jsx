// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Post from './Post'; // for the expanded view
// import CommentModal from './components/CommentModal'; // import the modal

// function Recipe() {
//   const [recipes, setRecipes] = useState([]);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [likes, setLikes] = useState({}); // to track like toggles
//   const [stars, setStars] = useState({}); // to track individual ratings
//   const [activeCommentPostId, setActiveCommentPostId]=useState(null)

//   const regular = "fa-regular fa-star";
//   const solid = "fa-solid fa-star";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         const [recipeRes, likedRes] = await Promise.all([
//           axios.get(`${import.meta.env.VITE_API_URL}/recipes`, {
//             headers: { 'x-auth-token': token || '' },
//           }),
//           axios.get(`${import.meta.env.VITE_API_URL}/recipes/liked`, {
//             headers: { 'x-auth-token': token || '' },
//           }),
//         ]);

//         setRecipes(recipeRes.data);

//         // Mark recipes liked by user
//         const likedMap = {};
//         likedRes.data.forEach(id => likedMap[id] = true);
//         setLikes(likedMap);

//       } catch (err) {
//         console.error("Error fetching recipes or likes:", err);
//       }
//     };

//     fetchData();
//   }, []);



  
//   const handleLikeToggle = (id) => {
//     setLikes(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   const handleStarClick = (id, index) => {
//     setStars(prev => ({
//       ...prev,
//       [id]: (index + 1 === prev[id] ? index : index + 1)
//     }));
//   };

//   const handleLearnMoreClick = (recipe) => {
//     if (selectedPost?._id === recipe._id) {
//       setSelectedPost(null); // Collapse if already expanded
//     } else {
//       setSelectedPost(recipe); // Expand the clicked post
//     }
//   };

//   return (
//     <>
//       {recipes.map((recipe) => (
//         <div key={recipe._id}>
//           <div className="post_container">
//             <div className="user_profile">
//               <i className="fa-solid fa-user" />
//               <div className="user_info">
//                 <h4 id="user_name">{recipe.user?.username || "Unknown"}</h4>
//                 <h4 id="user_badge">Culinary Creator</h4>
//               </div>
//             </div>

//             <img
//               src={recipe.image || '/default.jpg'}
//               alt="Food"
//               className="recipe-image"
//             />

//             <div className="post_interations">
//               <div className="like_comment">
//                 <i
//                   className={likes[recipe._id] ? "fa-solid fa-heart" : "fa-regular fa-heart"}
//                   onClick={() => handleLikeToggle(recipe._id)}
//                 />
//                 <i className="fa-regular fa-comment" />
//               </div>
//               <div className="ratings">
//                 {[...Array(5)].map((_, index) => (
//                   <i
//                     key={index}
//                     className={index < (stars[recipe._id] || 0) ? solid : regular}
//                     onClick={() => handleStarClick(recipe._id, index)}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="post-number">
//               <p><b>{likes[recipe._id] ? recipe.likeCount + 1 : recipe.likeCount} {recipe.likeCount === 1 ? "like" : "likes"}</b></p>
//               <p><b>{(stars[recipe._id] || 0)}.0 rated</b></p>
//             </div>

//             <p className="post-description">
//               <b>{recipe.title}</b> {recipe.caption?.slice(0, 100)}...
//               <button
//                 className="learn-more"
//                 onClick={() => handleLearnMoreClick(recipe)}
//               >
//                 {selectedPost?._id === recipe._id ? 'Go Back' : 'Learn More'}
//               </button>
//             </p>
//           </div>

//           {/* Conditionally render expanded view right after the selected post */}
//           {selectedPost?._id === recipe._id && (
//             <div className="expanded-post">
//               <Post recipe={selectedPost} />
//             </div>
//           )}
//         </div>
//       ))}
//     </>
//   );
// }

// export default Recipe;
import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import CommentModal from '../components/CommentModal';

function Recipe() {
  const [recipes, setRecipes] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({});
  const [stars, setStars] = useState({});
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [likeLocks, setLikeLocks] = useState({});

  const regular = "fa-regular fa-star";
  const solid = "fa-solid fa-star";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [recipeRes, likedRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/recipes`, {
            headers: { 'x-auth-token': token || '' },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/recipes/liked`, {
            headers: { 'x-auth-token': token || '' },
          }),
        ]);

        setRecipes(recipeRes.data);

        const likedMap = {};
        likedRes.data.forEach(id => likedMap[id] = true);
        setLikes(likedMap);

      } catch (err) {
        console.error("Error fetching recipes or likes:", err);
      }
    };

    fetchData();
  }, []);

  const handleLikeToggle = async (id) => {
    if (likeLocks[id]) return;

    const token = localStorage.getItem('token');
    const isLiked = likes[id];
    setLikeLocks(prev => ({ ...prev, [id]: true }));

    // Optimistic UI update
    setLikes(prev => ({ ...prev, [id]: !isLiked }));
    setRecipes(prev =>
      prev.map(recipe =>
        recipe._id === id
          ? { ...recipe, likeCount: recipe.likeCount + (isLiked ? -1 : 1) }
          : recipe
      )
    );

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/recipes/${id}/like`, {}, {
        headers: { 'x-auth-token': token || '' },
      });
    } catch (err) {
      console.error("Error liking recipe:", err);
      // Revert changes
      setLikes(prev => ({ ...prev, [id]: isLiked }));
      setRecipes(prev =>
        prev.map(recipe =>
          recipe._id === id
            ? { ...recipe, likeCount: recipe.likeCount + (isLiked ? 1 : -1) }
            : recipe
        )
      );
    } finally {
      setLikeLocks(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleStarClick = (id, index) => {
    setStars(prev => ({
      ...prev,
      [id]: (index + 1 === prev[id] ? index : index + 1)
    }));
  };

  const handleLearnMoreClick = (recipe) => {
    if (selectedPost?._id === recipe._id) {
      setSelectedPost(null); 
    } else {
      setSelectedPost(recipe); 
    }
  };

  return (
    <>
      {recipes.map((recipe) => (
        <div key={recipe._id}>
          <div className="post_container">
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
                <i
                  className="fa-regular fa-comment"
                  onClick={() => setActiveCommentPostId(recipe._id)}
                />
                <span style={{ marginLeft: "10px", fontSize: "14px", color: "#444" }}>
                  {recipe.commentCount || 0}
                </span>
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
              <p><b>{recipe.likeCount} {recipe.likeCount === 1 ? "like" : "likes"}</b></p>
              <p><b>{(stars[recipe._id] || 0)}.0 rated</b></p>
            </div>

            <p className="post-description">
              <b>{recipe.title}</b> {recipe.caption?.slice(0, 100)}...
              <button
                className="learn-more"
                onClick={() => handleLearnMoreClick(recipe)}
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
      ))}

      {activeCommentPostId && (
        <CommentModal
          recipeId={activeCommentPostId}
          onClose={() => setActiveCommentPostId(null)}
        />
      )}
    </>
  );
}

export default Recipe;
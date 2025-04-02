import { useState } from 'react';
import foodImage from './assets/food1.jpg';
import Post from './Post';

function Recipe() {
    const [heart, setHeart] = useState(false);
    const [stars, setStars] = useState(0); 
    const [likes, setLikes] = useState(0);
    const [post, setPost] = useState(false)

    const regular = "fa-regular fa-star";
    const solid = "fa-solid fa-star";

    function handleInteractions(type, index = null) {
        if (type === "heart") {
            setHeart(prevHeart => !prevHeart);
            setLikes(prevLikes=> prevLikes==1 ? 0 : 1)
        } else if (type === "stars") {
            setStars(prevStars => (index + 1 === prevStars ? index : index + 1));
        }
    }

    return (
        <>
            <div className="post_container">
                <div className="user_profile">     
                    <i className="fa-solid fa-user"/>
                    <div className="user_info">
                        <h4 id="user_name">Abdul Samad</h4>
                        <h4 id="user_badge">Culinary Champion</h4>
                    </div>
                </div>

                <img src={foodImage} alt="Food" className='recipe-image'/>

                <div className="post_interations">
                    <div className="like_comment">
                        <i 
                            className={heart ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                            onClick={() => handleInteractions("heart")} 
                        />
                        <i className="fa-regular fa-comment" />
                    </div>
                    <div className="ratings">
                        {[...Array(5)].map((_, index) => (
                            <i 
                                key={index} 
                                className={index < stars ? solid : regular} 
                                onClick={() => handleInteractions("stars", index)} 
                            />
                        ))}
                    </div>
                </div>

                <div className="post-number">
                    <p><b>{likes} {likes==1 ? "like" : "likes"}</b></p>
                    <p><b>{stars}.0 rated</b></p>
                </div>

                <p className='post-description'>
                    <b>Chicken Curry with Rice</b> Lorem ipsum dolor sit amet consectetur adipisicing elit...
                    {!post && ( <>
                        <button className='learn-more' onClick={()=>setPost(true)}>Learn More</button>
                    </>)}
                </p>
            </div>
            {post && <Post/>}
        </>
    );
}

export default Recipe;

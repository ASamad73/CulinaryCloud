// added by Mr Az ---------------------

import { useEffect, useState } from 'react';
import axios from 'axios';

function CommentModal({ recipeId, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${recipeId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/comments/${recipeId}`, {
        text
      }, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      setText("");
      fetchComments(); // Refresh comments after post
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Comments</h2>
        <div className="comment-list">
          {comments.map((c) => (
            <div key={c._id} className="comment-item">
              <strong>{c.user?.username || "User"}:</strong> {c.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
          />
          <button type="submit" className="comment-submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default CommentModal;


// added by Mr Az ---------------------
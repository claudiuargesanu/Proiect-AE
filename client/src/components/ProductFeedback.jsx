import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../utils/envUtils";

const ProductFeedback = ({ productId, userId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
  const loggedUserId = userFromStorage?.id; // folosim un nume diferit


  useEffect(() => {
    axios.get(`${getApiUrl()}/feedback/${productId}`).then((res) => {
      setFeedbacks(res.data.data);
    }).catch(err => console.error(err));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${getApiUrl()}/feedback`, { userId: loggedUserId, productId, rating, comment });
    setComment("");
    setRating(5);
    const res = await axios.get(`${getApiUrl()}/feedback/${productId}`);
    setFeedbacks(res.data.data);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Feedback</h3>
      {feedbacks.map(fb => (
        <div key={fb.id} style={{ marginBottom: "10px" }}>
          <p><b>{fb.user?.name || "Anonymous"}</b> ⭐ {fb.rating}</p>
          <p>{fb.comment}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <label>Rating:</label>
        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))}  />
        <br />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback"
        />
        <br />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default ProductFeedback;

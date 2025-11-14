import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl, getDummyApiUrl } from "../utils/envUtils";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
  const loggedUserId = userFromStorage?.id;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist items din backend
  const fetchWishlist = async () => {
    if (!loggedUserId) return;

    try {
      const res = await axios.get(`${getApiUrl()}/wishlist/${loggedUserId}`);
      const wishlistData = res.data.data; // array cu { id, userId, productId }

      // Pentru fiecare productId, facem fetch la dummy API pentru detalii
      const detailedItems = await Promise.all(
        wishlistData.map(async (item) => {
          try {
            const productRes = await axios.get(`${getDummyApiUrl()}/products/${item.productId}`);
            return {
              ...item,
              product: productRes.data, // titlu, thumbnail, price etc.
            };
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}`, err);
            return { ...item, product: { title: "Product not found" } };
          }
        })
      );

      setWishlist(detailedItems);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [loggedUserId]);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${getApiUrl()}/wishlist`, { data: { userId: loggedUserId, productId } });
      setWishlist(prev => prev.filter(item => item.productId !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      alert(err.response?.data?.message || "Error removing product");
    }
  };

  if (!loggedUserId) return <div>Please login to see your wishlist.</div>;
  if (loading) return <div>Loading wishlist...</div>;
  if (wishlist.length === 0) return <div>Your wishlist is empty.</div>;

  return (
    <div style={{ margin: "30px" }}>
      <h2>My Wishlist</h2>
      {wishlist.map(item => (
        <div key={item.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
          <Link to={`/product/${item.productId}`}>
            <h3>{item.product.title}</h3>
          </Link>
          {item.product.thumbnail && (
            <img src={item.product.thumbnail} alt={item.product.title} width={150} />
          )}
          {item.product.price && <p><b>Price:</b> ${item.product.price}</p>}
          <button onClick={() => removeFromWishlist(item.productId)}>Remove from Wishlist</button>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;

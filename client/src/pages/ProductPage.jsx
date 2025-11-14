import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDummyApiUrl, getApiUrl } from "../utils/envUtils";
import ProductFeedback from "../components/ProductFeedback";
import { FaHeart } from "react-icons/fa";

const ProductPage = ({ user }) => {
  const { id } = useParams();

  // === STĂRI ===
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]); // starea pentru wishlist
  
  const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
  const loggedUserId = userFromStorage?.id;

  // === FETCH PRODUS ===
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${getDummyApiUrl()}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  // === FETCH WISHLIST ===
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!loggedUserId) return;
      try {
        const res = await axios.get(`${getApiUrl()}/wishlist/${loggedUserId}`);
        // salvăm doar productId-urile pentru a putea verifica dacă sunt în wishlist
        setWishlist(res.data.data.map(item => item.productId));
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, [loggedUserId]); // rulează când se schimbă loggedUserId

  // === FUNCȚII WISHLIST ===
  const addToWishlist = async (productId) => {
    try {
      await axios.post(`${getApiUrl()}/wishlist`, { userId: loggedUserId, productId });
      setWishlist(prev => [...prev, productId]); // actualizăm starea locală
      alert("Added to wishlist!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${getApiUrl()}/wishlist`, { data: { userId: loggedUserId, productId } });
      setWishlist(prev => prev.filter(id => id !== productId)); // actualizăm starea locală
      alert("Removed from wishlist!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error");
    }
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  if (!product) return <div>Loading product...</div>;

  const isInWishlist = wishlist.includes(product.id);

  return (
    <div style={{ margin: "30px" }}>
      <h2>
        {product.title}
        <FaHeart
  onClick={() => toggleWishlist(product.id)}
  style={{
    cursor: "pointer",
    color: isInWishlist ? "red" : "grey",
    fontSize: "24px",
  }}
/>

      </h2>
      <img src={product.thumbnail} alt={product.title} width={250} />
      <p><b>Price:</b> ${product.price}</p>
      <p>{product.description}</p>
      <hr />
      <ProductFeedback productId={product.id} userId={loggedUserId} />
    </div>
  );
};

export default ProductPage;

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLoggedIn } from "../store/slices/globalSlice";

function Navbar() {
  const { loggedIn } = useSelector((state) => state.global);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
  const userName = userFromStorage?.name;
  const logoutUser = () => {
    dispatch(setLoggedIn(false));
    localStorage.removeItem("token");
  };

  const getCartLength = () => {
    return cart?.reduce((acc, item) => acc + item.quantity, 0);
  }

  return (
    <div
  className="navbarWrapper"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "1px solid #ccc"
  }}
>
  {/* Partea stanga */}
  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
    <Link to="/">Homepage</Link>
    {loggedIn && <span>Bună, {userName}</span>}
  </div>

  {/* Partea dreapta */}
  {loggedIn ? (
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      <Link to="/wishlist">My Wishlist ❤️</Link>
      <Link to="/cart">
        <i className="fas fa-shopping-cart"></i>
        <span style={{ paddingLeft: "4px" }}>Cart {getCartLength()}</span>
      </Link>
      <Link to="/" onClick={logoutUser}>Logout</Link>
    </div>
  ) : (
    <Link to="/login">Login</Link>
  )}
</div>
  );
}

export default Navbar;

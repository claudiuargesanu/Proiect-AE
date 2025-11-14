import { useDispatch, useSelector } from "react-redux";
import {
  updateCart,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";
import { useState } from "react";
import { createOrder } from "../routes/orders";
import { toast } from "react-toastify";

const Cart = () => {
  const { token } = useSelector((state) => state.global);
  const { cart } = useSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const reqToken = localStorage.getItem('token');
    if (!reqToken) {
      toast.error("You need to be logged in to checkout");
      return;
    }

    const total = Number(cartTotal());

    const response = await createOrder({ ...formData, total }, token);
    console.log(response);
  };

  const handleQuantityChange = (product, quantity) => {
    if (quantity > 0) {
      dispatch(updateCart({ id: product.id, quantity }));
    } else {
      dispatch(removeFromCart({ id: product.id }));
    }
  };

  const cartTotal = () => {
    return cart
      .reduce((total, product) => total + product.price * product.quantity, 0)
      .toFixed(2);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div>
      <div className="cart-container">
        <div className="w-1/4 flex flex-col justify-center">
          <label
            htmlFor="name-input"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name-input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block !w-full p-2.5"
          />

          <label
            htmlFor="phone-input"
            className="block mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone-input"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block !w-full p-2.5"
          />

          <label
            htmlFor="address-input"
            className="block mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Address
          </label>
          <input
            type="text"
            id="address-input"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block !w-full p-2.5"
          />

          <label
            htmlFor="city-input"
            className="block mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            City
          </label>
          <input
            type="text"
            id="city-input"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block !w-full p-2.5"
          />
        </div>

        <div className="cart-items max-h-[400px] overflow-auto">
          {cart.map((product) => (
            <div key={product.id} className="cart-item">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{product.title}</h3>
                <p>Price: ${product.price.toFixed(2)}</p>
                <div className="cart-item-buttons">
                  <div>
                    <button
                      onClick={() =>
                        handleQuantityChange(product, product.quantity - 1)
                      }
                    >
                      -
                    </button>
                  </div>
                  <span>{product.quantity}</span>
                  <div>
                    <button
                      onClick={() =>
                        handleQuantityChange(product, product.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total: ${cartTotal()}</h3>
        </div>
        <div className="cart-buttons">
          <button className="cart-button" onClick={handleClearCart}>
            Clear Cart
          </button>
          <button className="cart-button" onClick={handleSubmit}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

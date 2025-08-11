import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import cartService from '../services/cartService';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCart(token);
            setCartItems(data);
        } catch (err) {
            setError('Failed to fetch cart items.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart();
        }
    }, [token]);

    const handleRemove = async (productId) => {
        try {
            await cartService.removeFromCart(productId, token);
            fetchCart(); // Refresh cart
        } catch (err) {
            alert('Failed to remove item.');
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '1rem 0' }}>
                            <div>
                                <h4>{item.product.name}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.product.price.toFixed(2)}</p>
                            </div>
                            <button onClick={() => handleRemove(item.product._id)}>Remove</button>
                        </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '2rem', fontSize: '1.5rem' }}>
                        <strong>Total: ${total.toFixed(2)}</strong>
                    </div>
                    <button onClick={() => navigate('/checkout')} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;

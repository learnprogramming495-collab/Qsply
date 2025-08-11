import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import cartService from '../services/cartService';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();
    const { showSnackbar } = useSnackbar();
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
            showSnackbar('Item removed from cart', 'success');
            fetchCart(); // Refresh cart
        } catch (err) {
            showSnackbar('Failed to remove item.', 'error');
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Shopping Cart
            </Typography>
            {cartItems.length === 0 ? (
                <Typography>Your cart is empty.</Typography>
            ) : (
                <>
                    <List>
                        {cartItems.map(item => (
                            <ListItem key={item.product._id} divider>
                                <ListItemText
                                    primary={item.product.name}
                                    secondary={`Quantity: ${item.quantity} @ $${item.product.price.toFixed(2)} each`}
                                />
                                <ListItemSecondaryAction>
                                    <Typography variant="body1" sx={{ mr: 2 }}>
                                        ${(item.quantity * item.product.price).toFixed(2)}
                                    </Typography>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item.product._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ my: 2 }}/>
                    <Box sx={{ textAlign: 'right', my: 2 }}>
                        <Typography variant="h5">
                            Total: ${total.toFixed(2)}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </Button>
                </>
            )}
        </Paper>
    );
};

export default CartPage;

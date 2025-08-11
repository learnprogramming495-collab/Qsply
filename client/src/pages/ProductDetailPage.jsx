import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import productService from '../services/productService';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { Grid, Box, Typography, Button, CircularProgress, Paper, Divider, Chip } from '@mui/material';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { token } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(productId);
                setProduct(data);
            } catch (err) {
                setError('Failed to fetch product details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        if (!token) {
            showSnackbar('You must be logged in to add items to the cart.', 'warning');
            return;
        }
        try {
            await cartService.addToCart(product._id, 1, token);
            showSnackbar(`${product.name} added to cart!`, 'success');
        } catch (err) {
            showSnackbar('Failed to add product to cart.', 'error');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" align="center">{error}</Typography>;
    if (!product) return <Typography align="center">Product not found.</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 500,
                            objectFit: 'cover',
                            borderRadius: 2,
                        }}
                        src={product.imageUrl || 'https://via.placeholder.com/600x400'}
                        alt={product.name}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Chip label={product.category} color="secondary" sx={{ mb: 2 }} />
                    <Typography variant="h3" component="h1" gutterBottom>{product.name}</Typography>
                    <Typography variant="h4" color="primary" gutterBottom>${product.price.toFixed(2)}</Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Sold by: <strong>{product.seller?.username || 'N/A'}</strong>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>{product.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quantity available: {product.quantity}
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Button variant="contained" size="large" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ProductDetailPage;

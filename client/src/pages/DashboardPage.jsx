import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import productService from '../services/productService';
import cartService from '../services/cartService';
import ProductFilters from '../components/ProductFilters';
import CreateProductForm from '../components/CreateProductForm';
import { Grid, Card, CardContent, CardActions, Button, Typography, Box, CircularProgress, CardMedia } from '@mui/material';

const DashboardPage = () => {
    const { user, token } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({});

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts(filters);
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    const handleProductCreate = async (productData) => {
        try {
            await productService.createProduct(productData, token);
            showSnackbar('Product created successfully!', 'success');
            fetchProducts(); // Refresh product list
        } catch (err) {
            console.error("Product creation failed:", err);
            showSnackbar('Failed to create product.', 'error');
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await cartService.addToCart(productId, 1, token);
            showSnackbar('Product added to cart!', 'success');
        } catch (err) {
            console.error("Add to cart failed:", err);
            showSnackbar('Failed to add product to cart.', 'error');
        }
    };

    const isFarmer = user && user.role === 'farmer';

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Marketplace
            </Typography>

            {isFarmer && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Create a New Product Listing
                        </Typography>
                        <CreateProductForm onCreate={handleProductCreate} />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Available Products
                    </Typography>
                    <ProductFilters onFilterChange={handleFilterChange} />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {products.map(product => (
                                <Grid item key={product._id} xs={12} sm={6} md={4}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div">{product.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>{product.category}</Typography>
                                            <Typography variant="h5" color="primary" sx={{ my: 1 }}>${product.price.toFixed(2)}</Typography>
                                            <Typography variant="body2">{product.description}</Typography>
                                            <Typography variant="caption" display="block" color="text.secondary" sx={{mt: 2}}>Seller: {product.seller?.username || 'N/A'}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => handleAddToCart(product._id)}>Add to Cart</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default DashboardPage;

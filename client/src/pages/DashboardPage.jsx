import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import productService from '../services/productService';
import cartService from '../services/cartService';
import ProductFilters from '../components/ProductFilters';
import CreateProductForm from '../components/CreateProductForm';
import AppPagination from '../components/AppPagination';
import { Grid, Card, CardContent, CardActions, Button, Typography, Box, CircularProgress, CardMedia } from '@mui/material';

const DashboardPage = () => {
    const { user, token } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params = { ...filters, page: pagination.currentPage, limit: 9 };
            const data = await productService.getAllProducts(params);
            setProducts(data.products);
            setPagination(prev => ({ ...prev, totalPages: data.totalPages }));
        } catch (err) {
            setError('Failed to fetch products.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = useCallback((newFilters) => {
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 on new filter
        setFilters(newFilters);
    }, []);

    const handlePageChange = (event, value) => {
        setPagination(prev => ({ ...prev, currentPage: value }));
    };

    const handleProductCreate = async (productData) => {
        try {
            await productService.createProduct(productData, token);
            showSnackbar('Product created successfully!', 'success');
            fetchProducts();
        } catch (err) {
            showSnackbar('Failed to create product.', 'error');
        }
    };

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await cartService.addToCart(productId, 1, token);
            showSnackbar('Product added to cart!', 'success');
        } catch (err) {
            showSnackbar('Failed to add product to cart.', 'error');
        }
    };

    const isFarmer = user && user.role === 'farmer';

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>Marketplace</Typography>
            {isFarmer && (
                <Card sx={{ mb: 4 }}><CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>Create a New Product Listing</Typography>
                    <CreateProductForm onCreate={handleProductCreate} />
                </CardContent></Card>
            )}
            <Card><CardContent>
                <Typography variant="h5" component="h2" gutterBottom>Available Products</Typography>
                <ProductFilters onFilterChange={handleFilterChange} />
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {products.map(product => (
                                <Grid item key={product._id} xs={12} sm={6} md={4}>
                                    <Card component={RouterLink} to={`/products/${product._id}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
                                        {product.imageUrl && <CardMedia component="img" height="160" image={product.imageUrl} alt={product.name} />}
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div">{product.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>{product.category}</Typography>
                                            <Typography variant="h5" color="primary" sx={{ my: 1 }}>${product.price.toFixed(2)}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={(e) => handleAddToCart(e, product._id)}>Add to Cart</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <AppPagination count={pagination.totalPages} page={pagination.currentPage} onChange={handlePageChange} />
                    </>
                )}
            </CardContent></Card>
        </Box>
    );
};

export default DashboardPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import cartService from '../services/cartService'; // For Add to Cart
import ProductFilters from '../components/ProductFilters';
import CreateProductForm from '../components/CreateProductForm';

const DashboardPage = () => {
    const { user, token } = useAuth();
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
            fetchProducts(); // Refresh product list
        } catch (err) {
            console.error("Product creation failed:", err);
            alert('Failed to create product. See console for details.');
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await cartService.addToCart(productId, 1, token);
            alert('Product added to cart!');
        } catch (err) {
            console.error("Add to cart failed:", err);
            alert('Failed to add product to cart.');
        }
    };

    const isFarmer = user && user.role === 'farmer';

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Marketplace Dashboard</h1>

            {isFarmer && (
                <div style={{ marginBottom: '2rem', padding: '2rem', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                    <h2>Create a New Product Listing</h2>
                    <CreateProductForm onCreate={handleProductCreate} />
                </div>
            )}

            <div>
                <h2>Available Products</h2>
                <ProductFilters onFilterChange={handleFilterChange} />
                {loading && <p>Loading products...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {!loading && products.map(product => (
                        <div key={product._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', backgroundColor: 'white' }}>
                            <h3>{product.name}</h3>
                            <p><strong>Category:</strong> {product.category}</p>
                            <p>{product.description}</p>
                            <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                            <p><small>Seller: {product.seller?.username || 'N/A'}</small></p>
                            <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
// We will create these components later
// import ProductList from '../components/ProductList';
// import CreateProductForm from '../components/CreateProductForm';

const DashboardPage = () => {
    const { user, token } = useAuth();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductCreate = async (productData) => {
        try {
            await productService.createProduct(productData, token);
            // Refresh product list after creation
            fetchProducts();
        } catch (err) {
            console.error("Product creation failed:", err);
            // You might want to set an error state here to show in the form
        }
    };

    const isFarmer = user && user.role === 'farmer';

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.role}!</p>

            {isFarmer && (
                <div style={{ marginBottom: '2rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h2>Create a New Product Listing</h2>
                    {/* This would be its own component in a larger app */}
                    {/* <CreateProductForm onCreate={handleProductCreate} /> */}
                </div>
            )}

            <div>
                <h2>Available Products</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {products.map(product => (
                        <div key={product._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', backgroundColor: 'white' }}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                            <p><small>Seller: {product.seller?.username || 'N/A'}</small></p>
                            <button>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await orderService.getOrderHistory(token);
                setOrders(data);
            } catch (err) {
                setError('Failed to fetch order history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <strong>Order ID:</strong> {order._id} <br />
                                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Total: ${order.totalPrice.toFixed(2)}</strong> <br />
                                    <strong>Status:</strong> {order.status}
                                </div>
                            </div>
                            <div>
                                {order.products.map(p => (
                                    <p key={p.productId}>{p.name} (x{p.quantity})</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;

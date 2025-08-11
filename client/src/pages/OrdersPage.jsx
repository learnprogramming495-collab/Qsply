import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Card, CardContent } from '@mui/material';

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

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Orders
            </Typography>
            {orders.length === 0 ? (
                <Typography>You have no past orders.</Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {orders.map(order => (
                        <Card key={order._id} variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Order ID: {order._id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Date: {new Date(order.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <List dense>
                                    {order.products.map(p => (
                                        <ListItem key={p.productId} disableGutters>
                                            <ListItemText
                                                primary={`${p.name} (x${p.quantity})`}
                                                secondary={`$${p.price.toFixed(2)} each`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider sx={{ my: 2 }}/>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body1">
                                        Status: <strong>{order.status}</strong>
                                    </Typography>
                                    <Typography variant="h6">
                                        Total: ${order.totalPrice.toFixed(2)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Paper>
    );
};

export default OrdersPage;

import axios from 'axios';

const API_URL = '/api/orders';

const createOrder = async (shippingAddress, token) => {
    const config = { headers: { 'x-auth-token': token } };
    const response = await axios.post(API_URL, { shippingAddress }, config);
    return response.data;
};

const getOrderHistory = async (token) => {
    const config = { headers: { 'x-auth-token': token } };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const orderService = {
    createOrder,
    getOrderHistory,
};

export default orderService;

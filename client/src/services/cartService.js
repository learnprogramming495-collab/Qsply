import axios from 'axios';

const API_URL = '/api/cart';

const getCart = async (token) => {
    const config = { headers: { 'x-auth-token': token } };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const addToCart = async (productId, quantity, token) => {
    const config = { headers: { 'x-auth-token': token } };
    const response = await axios.post(API_URL, { productId, quantity }, config);
    return response.data;
};

const removeFromCart = async (productId, token) => {
    const config = { headers: { 'x-auth-token': token } };
    const response = await axios.delete(`${API_URL}/${productId}`, config);
    return response.data;
};

const cartService = {
    getCart,
    addToCart,
    removeFromCart,
};

export default cartService;

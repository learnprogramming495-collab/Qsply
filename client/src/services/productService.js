import axios from 'axios';

const API_URL = '/api/products';

const getAllProducts = async (filters = {}) => {
    // URLSearchParams will correctly format the query string
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
};

const createProduct = async (productData, token) => {
    const config = {
        headers: {
            'x-auth-token': token,
        },
    };
    const response = await axios.post(API_URL, productData, config);
    return response.data;
};

const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const productService = {
    getAllProducts,
    createProduct,
    getProductById,
};

export default productService;

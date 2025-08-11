import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Alert, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const CreateProductForm = ({ onCreate, error }) => {
    const { token } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Vegetable',
        quantity: '',
        price: '',
        imageUrl: '',
    });
    const [uploading, setUploading] = useState(false);

    const categories = ['Vegetable', 'Fruit', 'Grain', 'Dairy', 'Meat', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token,
                },
            };
            const { data } = await axios.post('/api/upload', uploadData, config);
            setFormData(prev => ({ ...prev, imageUrl: data.filePath }));
            showSnackbar('Image uploaded successfully!', 'success');
        } catch (err) {
            console.error('Image upload failed', err);
            showSnackbar(err.response?.data?.msg || 'Image upload failed.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        setFormData({ name: '', description: '', category: 'Vegetable', quantity: '', price: '', imageUrl: '' });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField name="name" label="Product Name" value={formData.name} onChange={handleChange} required fullWidth />
            <TextField name="description" label="Description" value={formData.description} onChange={handleChange} multiline rows={3} fullWidth />

            <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} label="Category" onChange={handleChange}>
                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
            </FormControl>

            <TextField name="quantity" label="Quantity (kg)" type="number" value={formData.quantity} onChange={handleChange} required fullWidth />
            <TextField name="price" label="Price ($)" type="number" value={formData.price} onChange={handleChange} required fullWidth />

            <Box>
                <Button variant="outlined" component="label">
                    Upload Image
                    <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                </Button>
                {formData.imageUrl && <Typography variant="caption" sx={{ ml: 2 }}>{formData.imageUrl.split('/').pop()}</Typography>}
            </Box>
            {uploading && <LinearProgress sx={{ my: 1 }} />}

            <Button type="submit" variant="contained" color="primary" size="large" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Create Listing'}
            </Button>
        </Box>
    );
};

export default CreateProductForm;

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';

const CreateProductForm = ({ onCreate, error }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Vegetable',
        quantity: '',
        price: '',
    });

    const categories = ['Vegetable', 'Fruit', 'Grain', 'Dairy', 'Meat', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        setFormData({ name: '', description: '', category: 'Vegetable', quantity: '', price: '' });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
                name="name"
                label="Product Name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
            />
            <TextField
                name="description"
                label="Description"
                variant="outlined"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
            />
            <FormControl fullWidth required>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                    labelId="category-select-label"
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleChange}
                >
                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
            </FormControl>
            <TextField
                name="quantity"
                label="Quantity (e.g., in kg)"
                type="number"
                variant="outlined"
                value={formData.quantity}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
                name="price"
                label="Price per unit"
                type="number"
                variant="outlined"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{ inputProps: { min: 0, step: "0.01" } }}
            />
            <Button type="submit" variant="contained" color="primary" size="large">
                Create Listing
            </Button>
        </Box>
    );
};

export default CreateProductForm;

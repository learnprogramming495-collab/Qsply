import React, { useState } from 'react';

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
};

const inputStyle = {
    padding: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
};

const buttonStyle = {
    padding: '0.8rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
};

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
        // Optionally clear form after submission if parent component doesn't handle it
        setFormData({ name: '', description: '', category: 'Vegetable', quantity: '', price: '' });
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={inputStyle} />
            <select name="category" value={formData.category} onChange={handleChange} required style={inputStyle}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input type="number" name="quantity" placeholder="Quantity (e.g., in kg)" value={formData.quantity} onChange={handleChange} required min="0" style={inputStyle} />
            <input type="number" name="price" placeholder="Price per unit" value={formData.price} onChange={handleChange} required min="0" step="0.01" style={inputStyle} />
            <button type="submit" style={buttonStyle}>Create Listing</button>
        </form>
    );
};

export default CreateProductForm;

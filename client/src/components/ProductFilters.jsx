import React, { useState, useEffect, useCallback } from 'react';

const filterContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '2rem',
};

const inputStyle = {
    padding: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
};

const ProductFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt_desc'
    });

    const categories = ['All', 'Vegetable', 'Fruit', 'Grain', 'Dairy', 'Meat', 'Other'];
    const sortOptions = [
        { value: 'createdAt_desc', label: 'Newest' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A-Z' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Debounce the filter change to avoid excessive API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            // Remove empty values before passing up
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );
            onFilterChange(activeFilters);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [filters, onFilterChange]);

    return (
        <div style={filterContainerStyle}>
            <input type="text" name="search" placeholder="Search products..." value={filters.search} onChange={handleChange} style={{ ...inputStyle, flexGrow: 1 }} />
            <select name="category" value={filters.category} onChange={handleChange} style={inputStyle}>
                {categories.map(cat => <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>)}
            </select>
            <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleChange} style={{ ...inputStyle, width: '100px' }} />
            <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleChange} style={{ ...inputStyle, width: '100px' }} />
            <select name="sortBy" value={filters.sortBy} onChange={handleChange} style={inputStyle}>
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );
};

export default ProductFilters;

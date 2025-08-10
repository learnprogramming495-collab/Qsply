document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userInfoDiv = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const farmerSection = document.getElementById('farmer-section');
    const productListingsDiv = document.getElementById('product-listings');
    const createProductForm = document.getElementById('create-product-form');
    const formMessageDiv = document.getElementById('form-message');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    let user;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user;
    } catch (e) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        return;
    }

    if (user && user.role) {
        userInfoDiv.textContent = `Welcome! (Role: ${user.role})`;
        if (user.role === 'farmer') {
            farmerSection.style.display = 'block';
        }
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch products');
            const products = await res.json();

            productListingsDiv.innerHTML = '';
            if (products.length === 0) {
                productListingsDiv.innerHTML = '<p>No products have been listed yet.</p>';
            } else {
                products.forEach(product => {
                    const productEl = document.createElement('div');
                    productEl.className = 'product-item';
                    productEl.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>${product.description || 'No description available.'}</p>
                        <p><strong>Quantity:</strong> ${product.quantity}</p>
                        <p class="price"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                        <p><small>Seller: ${product.seller ? product.seller.username : 'Unknown'}</small></p>
                        <button class="add-to-cart-btn" data-product-id="${product._id}">Add to Cart</button>
                    `;
                    productListingsDiv.appendChild(productEl);
                });
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            productListingsDiv.innerHTML = '<p style="color: red;">Could not load products.</p>';
        }
    };

    if (createProductForm) {
        createProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // ... (form submission logic remains the same)
        });
    }

    // Add to Cart event listener
    productListingsDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.productId;
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({ productId, quantity: 1 }) // Add 1 by default
                });

                if (res.ok) {
                    alert('Product added to cart!');
                } else {
                    const data = await res.json();
                    alert(data.msg || 'Failed to add product to cart.');
                }
            } catch (err) {
                console.error('Add to cart error:', err);
                alert('A network error occurred.');
            }
        }
    });

    fetchProducts();
});

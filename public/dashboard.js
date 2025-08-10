document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userInfoDiv = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const farmerSection = document.getElementById('farmer-section');
    const productListingsDiv = document.getElementById('product-listings');
    const createProductForm = document.getElementById('create-product-form');
    const formMessageDiv = document.getElementById('form-message');

    // 1. Redirect to login if no token is found
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Decode token to get user info
    let user;
    try {
        // This is a simple client-side decoding. A more robust solution might be an API endpoint like /api/users/me
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = payload.user;
    } catch (e) {
        console.error('Invalid token:', e);
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        return;
    }

    // 3. Display user info and show farmer-specific content
    if (user && user.role) {
        userInfoDiv.textContent = `Welcome! (Role: ${user.role})`;
        if (user.role === 'farmer') {
            farmerSection.style.display = 'block';
        }
    }

    // 4. Handle Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    // 5. Fetch and Display Products
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch products');

            const products = await res.json();

            productListingsDiv.innerHTML = ''; // Clear before populating
            if (products.length === 0) {
                productListingsDiv.innerHTML = '<p>No products have been listed yet.</p>';
                return;
            }

            products.forEach(product => {
                const productEl = document.createElement('div');
                productEl.className = 'product-item';
                productEl.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description || 'No description available.'}</p>
                    <p><strong>Quantity:</strong> ${product.quantity}</p>
                    <p class="price"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                    <p><small>Seller: ${product.seller ? product.seller.username : 'Unknown'}</small></p>
                `;
                productListingsDiv.appendChild(productEl);
            });
        } catch (err) {
            console.error('Error fetching products:', err);
            productListingsDiv.innerHTML = '<p style="color: red;">Could not load products.</p>';
        }
    };

    // 6. Handle "Create Product" Form Submission
    if (createProductForm) {
        createProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formMessageDiv.textContent = '';

            const productData = {
                name: document.getElementById('product-name').value,
                description: document.getElementById('product-description').value,
                quantity: document.getElementById('product-quantity').value,
                price: document.getElementById('product-price').value,
            };

            try {
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(productData)
                });

                const data = await res.json();

                if (res.status === 201) {
                    formMessageDiv.textContent = 'Product listed successfully!';
                    formMessageDiv.style.color = 'green';
                    createProductForm.reset();
                    fetchProducts(); // Refresh the product list
                } else {
                    formMessageDiv.textContent = data.msg || 'An error occurred.';
                    formMessageDiv.style.color = 'red';
                }
            } catch (err) {
                console.error('Create Product Error:', err);
                formMessageDiv.textContent = 'A network error occurred. Please try again.';
                formMessageDiv.style.color = 'red';
            }
        });
    }

    // Initial call to load products when the page loads
    fetchProducts();
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart', {
                headers: { 'x-auth-token': token }
            });
            if (!res.ok) throw new Error('Failed to fetch cart');
            const cart = await res.json();
            renderCart(cart);
        } catch (err) {
            console.error('Error fetching cart:', err);
            cartItemsDiv.innerHTML = '<p style="color: red;">Could not load your cart.</p>';
        }
    };

    const renderCart = (cart) => {
        cartItemsDiv.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Your shopping cart is empty.</p>';
        } else {
            cart.forEach(item => {
                // Ensure product is populated before trying to access its properties
                if (item.product) {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'cart-item';
                    const itemTotal = item.product.price * item.quantity;
                    total += itemTotal;
                    itemEl.innerHTML = `
                        <div class="cart-item-details">
                            <h4>${item.product.name}</h4>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Unit Price: $${item.product.price.toFixed(2)}</p>
                        </div>
                        <div>
                            <strong>$${itemTotal.toFixed(2)}</strong>
                            <button class="remove-btn" data-product-id="${item.product._id}">Remove</button>
                        </div>
                    `;
                    cartItemsDiv.appendChild(itemEl);
                }
            });
        }
        cartTotalDiv.textContent = `Total: $${total.toFixed(2)}`;
    };

    cartItemsDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const productId = e.target.dataset.productId;
            if (!confirm('Are you sure you want to remove this item from your cart?')) {
                return;
            }
            try {
                const res = await fetch(`/api/cart/${productId}`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) {
                    fetchCart(); // Refresh cart view
                } else {
                    alert('Failed to remove item from cart.');
                }
            } catch (err) {
                console.error('Remove item error:', err);
                alert('A network error occurred.');
            }
        }
    });

    fetchCart();
});

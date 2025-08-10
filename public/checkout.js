document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const summaryItemsUl = document.getElementById('summary-items');
    const summaryTotalDiv = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const messageDiv = document.getElementById('checkout-message');

    const fetchCartForSummary = async () => {
        try {
            const res = await fetch('/api/cart', {
                headers: { 'x-auth-token': token }
            });
            if (!res.ok) throw new Error('Failed to fetch cart');
            const cart = await res.json();

            if (cart.length === 0) {
                window.location.href = 'cart.html'; // Redirect if cart is empty
                return;
            }

            summaryItemsUl.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                if (item.product) {
                    const itemTotal = item.product.price * item.quantity;
                    total += itemTotal;
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${item.product.name} (x${item.quantity})</span> <span>$${itemTotal.toFixed(2)}</span>`;
                    summaryItemsUl.appendChild(li);
                }
            });
            summaryTotalDiv.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
        } catch (err) {
            console.error('Error fetching cart summary:', err);
            summaryItemsUl.innerHTML = '<li>Error loading cart summary.</li>';
        }
    };

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageDiv.textContent = '';
        const shippingAddress = document.getElementById('shipping-address').value;

        if (!shippingAddress.trim()) {
            messageDiv.textContent = 'Shipping address cannot be empty.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ shippingAddress })
            });

            if (res.status === 201) {
                window.location.href = 'orders.html?new=true';
            } else {
                const data = await res.json();
                messageDiv.textContent = data.msg || 'An error occurred while placing the order.';
                messageDiv.style.color = 'red';
            }
        } catch (err) {
            console.error('Checkout error:', err);
            messageDiv.textContent = 'A network error occurred. Please try again.';
            messageDiv.style.color = 'red';
        }
    });

    fetchCartForSummary();
});

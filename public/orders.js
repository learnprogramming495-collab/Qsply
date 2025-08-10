document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const orderConfirmationDiv = document.getElementById('order-confirmation');
    const orderHistoryDiv = document.getElementById('order-history');

    // Check for confirmation flag in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
        orderConfirmationDiv.style.display = 'block';
    }

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders', {
                headers: { 'x-auth-token': token }
            });
            if (!res.ok) throw new Error('Failed to fetch orders');
            const orders = await res.json();
            renderOrders(orders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            orderHistoryDiv.innerHTML = '<p style="color: red;">Could not load your order history.</p>';
        }
    };

    const renderOrders = (orders) => {
        orderHistoryDiv.innerHTML = '';
        if (orders.length === 0) {
            orderHistoryDiv.innerHTML = '<p>You have not placed any orders yet.</p>';
        } else {
            orders.forEach(order => {
                const orderEl = document.createElement('div');
                orderEl.className = 'order';

                const productsHtml = order.products.map(p => `
                    <div class="order-product">
                        <span>${p.name} (x${p.quantity})</span>
                        <span>$${(p.price * p.quantity).toFixed(2)}</span>
                    </div>
                `).join('');

                orderEl.innerHTML = `
                    <div class="order-header">
                        <div>
                            <strong>Order ID:</strong> ${order._id} <br>
                            <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            <strong>Total:</strong> $${order.totalPrice.toFixed(2)} <br>
                            <strong>Status:</strong> ${order.status}
                        </div>
                    </div>
                    <div class="order-body">
                        ${productsHtml}
                    </div>
                `;
                orderHistoryDiv.appendChild(orderEl);
            });
        }
    };

    fetchOrders();
});

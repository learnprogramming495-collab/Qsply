document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageDiv = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous messages
            messageDiv.textContent = '';
            messageDiv.style.color = 'initial';

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await res.json();

                if (res.status === 201 || res.ok) {
                    messageDiv.textContent = 'Registration successful! You can now log in.';
                    messageDiv.style.color = 'green';
                    registerForm.reset();
                    // In a real app, you might store the token and redirect:
                    // localStorage.setItem('token', data.token);
                    // window.location.href = '/dashboard.html';
                } else {
                    messageDiv.textContent = data.msg || 'An error occurred during registration.';
                    messageDiv.style.color = 'red';
                }
            } catch (err) {
                console.error('Registration Fetch Error:', err);
                messageDiv.textContent = 'A network error occurred. Please try again.';
                messageDiv.style.color = 'red';
            }
        });
    }
});

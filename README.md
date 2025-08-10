# AgriTech Platform - Nepal

This project is the backend and frontend foundation for an AgriTech and rural supply chain platform designed to connect farmers and buyers in Nepal. It provides a digital marketplace with user authentication, product listings, and a shopping cart.

## Features Implemented
- **User Authentication:** Secure user registration and login system using JSON Web Tokens (JWT). Supports 'farmer' and 'buyer' roles.
- **Product Marketplace:** Farmers can create, update, and delete product listings. All users can view available products.
- **Shopping Cart:** Authenticated users can add products to a personal shopping cart, view their cart, and remove items.
- **Deployment Ready:**
    - Configuration managed via environment variables.
    - Security headers set with Helmet.
    - Rate limiting implemented to prevent abuse.
    - Production-ready process management with PM2.

## Technologies Used
- **Backend:** Node.js, Express.js, MongoDB (with Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Deployment:** PM2, dotenv

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (running locally or a connection URI)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and update the variables as needed:
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A long, random, and secret string used for signing tokens.

## Running the Application

### Development Mode
To run the server with `nodemon` for automatic restarts during development:
```bash
npm start
```
The server will be available at `http://localhost:3000`.

### Production Mode
To run the server using the PM2 process manager for better reliability and performance:
```bash
npm run start:prod
```

You can manage the production process with the following PM2 commands:
- `pm2 list`: List all running processes.
- `pm2 stop agritech-api`: Stop the application.
- `pm2 restart agritech-api`: Restart the application.
- `pm2 logs agritech-api`: View the application logs.

## API Endpoints

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user and receive a JWT.
- `GET /api/products`: Get all product listings.
- `POST /api/products`: Create a new product (requires farmer role).
- `GET /api/cart`: Get the logged-in user's cart.
- `POST /api/cart`: Add an item to the cart.
- `DELETE /api/cart/:productId`: Remove an item from the cart.

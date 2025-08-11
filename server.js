const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        // Mongoose connection will be closed by Node's default exit behavior
        process.exit(0);
    });
});

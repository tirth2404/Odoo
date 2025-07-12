const app = require('./app');
const connectDB = require('./db/connect');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});



const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');
const listRoutes = require('./routes/listRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Headers:`, req.headers);
  next();
});

app.get('/', (req, res) => {
  res.send('MERN Stack API is running!');
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/lists', listRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
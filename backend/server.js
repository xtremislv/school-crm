const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
require('dotenv').config();


const app = express();


// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Health check — verify MongoDB connection
app.get('/api/health', (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    ok: ready,
    mongo: ready ? 'connected' : 'disconnected',
  });
});

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/notices',  require('./routes/notices'));
app.use('/api/sheets',   require('./routes/sheets'));


// MongoDB connection + server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('🚀 Server running on port', process.env.PORT || 5000)
    );
  })
  .catch(err => console.error('MongoDB error:', err));

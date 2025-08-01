const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const clc = require('cli-color');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authentication /authRoutes');
const taskRoutes = require('./routes/operations /taskRoutes');
require('dotenv').config();

const expressApp = express();
const http = require('http').createServer(expressApp);
const PORT = process.env.PORT || 3000;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(clc.green('✓'), 'Connected to MongoDB');
  } catch (error) {
    console.error(clc.red('✗'), 'MongoDB connection error:', error);
    process.exit(1);
  }
};
connectToDatabase();

expressApp.use(cors());
expressApp.use(bodyParser.json());

expressApp.use((req, res, next) => {
  const startTime = new Date();
  res.on('finish', () => {
    const endTime = new Date();
    const duration = endTime - startTime;

    let statusColor;
    if (res.statusCode >= 500) {
      statusColor = clc.red;
    } else if (res.statusCode >= 400) {
      statusColor = clc.yellow;
    } else if (res.statusCode >= 300) {
      statusColor = clc.cyan;
    } else if (res.statusCode >= 200) {
      statusColor = clc.green;
    } else {
      statusColor = clc.white;
    }

    console.log(`${req.method} ${req.originalUrl} - ${statusColor(res.statusCode)} - ${duration}ms`);
  });
  next();
});

expressApp.use('/api', authRoutes);
expressApp.use('/api', taskRoutes);

expressApp.get('/', (req, res) => {
  res.send("I am alive");
});

expressApp.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

expressApp.use((err, req, res, next) => {
  console.error(clc.red('✗'), 'Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

http.listen(PORT, () => {
  console.log(clc.green('✓'), `Server is running on port: ${clc.cyan(PORT)}`);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(clc.yellow('!'), 'MongoDB connection closed');
  process.exit(0);
});
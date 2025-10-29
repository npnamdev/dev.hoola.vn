require('dotenv').config();

const fastify = require('fastify')({ logger: false });
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const automationRoutes = require('./routes/automationRoutes');
require('./cron');

// Connect to database
connectDB();

// Register plugins


const isProd = process.env.NODE_ENV === 'production';

fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

fastify.register(require('@fastify/cookie'), {
  secret: process.env.COOKIE_SECRET || 'cookie-secret-change-this',
  parseOptions: {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    path: '/',
    domain: isProd ? '.wedly.info' : undefined,
    maxAge: 7 * 24 * 60 * 60,
  },
});


// Register routes
fastify.register(authRoutes);
fastify.register(automationRoutes);

// Health check routes
fastify.get('/', async (request, reply) => {
  return { message: 'Welcome to Fastify API with Mongoose!' };
});

fastify.get('/api/health', async (request, reply) => {
  return {
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 8080;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`✅ Server is running on http://localhost:${port}`);
    console.log(`🌍 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// redisClient.js
const { createClient } = require('redis');

const client = createClient();

client.on('error', (err) => {
  console.log('❌ Redis Client Error:', err);
});

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log('✅ Redis connected');
  }
};

module.exports = { client, connectRedis };

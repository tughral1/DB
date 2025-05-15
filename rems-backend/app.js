const { authenticate, authorizeRole } = require('./middlewares/auth');
require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const User = require('./models/user.model');
const Property = require('./models/property.model');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Relationships

User.hasMany(Property, { foreignKey: 'sellerId' });
Property.belongsTo(User, { foreignKey: 'sellerId' });

// Routes
const userRoutes = require('./routes/users'); 
const propertyRoutes = require('./routes/properties');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/properties', propertyRoutes);

// Sync Database and Start Server
async function init() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

app.listen(PORT, async () => {
  await init();
  console.log(`Server running on http://localhost:${PORT}`);
});
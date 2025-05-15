const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  property_id: { // Add this field explicitly
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  propertyType: {
    type: DataTypes.STRING(50),
    field: 'property_type'
  },
  status: {
    type: DataTypes.ENUM('available', 'sold', 'rented'),
    defaultValue: 'available'
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'seller_id'
  }
}, {
  timestamps: true,
  tableName: 'properties'
});

module.exports = Property;
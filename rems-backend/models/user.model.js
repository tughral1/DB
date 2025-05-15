const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'buyer', 'seller', 'agent'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false, // Disable Sequelize's automatic timestamps
  tableName: 'users',
  hooks: {
    beforeCreate: (user) => {
      user.created_at = new Date();
      user.updated_at = new Date();
    },
    beforeUpdate: (user) => {
      user.updated_at = new Date();
    }
  }
});

module.exports = User;
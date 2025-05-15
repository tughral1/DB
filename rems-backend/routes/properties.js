const express = require('express');
const router = express.Router();
const { Property, User } = require('../models');
const { authenticate, authorizeRole } = require('../middlewares/auth');

// Create Property (Protected: Sellers/Agents only)
router.post(
  '/',
  authenticate,
  authorizeRole('seller', 'agent'),
  async (req, res) => {
    try {
      const property = await Property.create({
        ...req.body,
        sellerId: req.user.user_id // Automatically set from JWT
      });
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get All Properties (Public)
router.get('/', async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [{
        model: User,
        as: 'seller',
        attributes: ['user_id', 'name', 'email', 'phone'],
        where: { role: ['seller', 'agent'] }
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get Single Property (Public)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['name', 'email', 'phone']
      }]
    });
    
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Property (Protected: Owner only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        property_id: req.params.id,
        sellerId: req.user.user_id
      }
    });

    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    await property.update(req.body);
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Property (Protected: Owner/Admin)
router.delete('/:id', authenticate, authorizeRole('seller', 'agent', 'admin'), async (req, res) => {
  try {
    const whereClause = {
      property_id: req.params.id
    };

    // Admins can delete any property
    if (req.user.role !== 'admin') {
      whereClause.sellerId = req.user.user_id;
    }

    const result = await Property.destroy({ where: whereClause });
    
    if (!result) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
// routes/users.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate, authorizeRole } = require('../middlewares/auth');

// Update user role (Admin only)
router.put('/:userId/role', 
  authenticate, 
  authorizeRole('admin'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      await user.update({ role });
      res.json({ message: 'Role updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
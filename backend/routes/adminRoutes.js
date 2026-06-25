const express = require('express');
const router = express.Router();
const {
  manageUsers,
  updateUserRole,
  deleteUser,
  dashboardAnalytics,
  getSystemConfig,
  updateSystemConfig,
  resetDatabase,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/users', authorize('admin'), manageUsers);
router.put('/users/:id/role', authorize('admin'), updateUserRole);
router.delete('/users/:id', authorize('admin'), deleteUser);
router.get('/analytics', authorize('coordinator', 'admin'), dashboardAnalytics);
router.get('/config', getSystemConfig);
router.put('/config', authorize('admin'), updateSystemConfig);
router.post('/reset-db', authorize('admin'), resetDatabase);

module.exports = router;

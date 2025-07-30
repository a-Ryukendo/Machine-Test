const express = require('express');
const router = express.Router();
const { 
  getAgents, 
  getAgentById, 
  registerAgent, 
  updateAgent, 
  deleteAgent 
} = require('../controllers/agentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getAgents)
  .post(registerAgent);

router.route('/:id')
  .get(getAgentById)
  .put(updateAgent)
  .delete(deleteAgent);

module.exports = router;
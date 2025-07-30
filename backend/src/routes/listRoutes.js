const express = require('express');
const router = express.Router();
const { upload, uploadAndDistributeList, getDistributedLists } = require('../controllers/listController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/upload', protect, authorizeRoles('admin'), upload.single('file'), uploadAndDistributeList);


router.get('/', protect, authorizeRoles('admin'), getDistributedLists);

module.exports = router;
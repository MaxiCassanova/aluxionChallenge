const express = require('express');
const { authValidator } = require('../middlewares/authValidator');
const { searchController,
        uploadController, } = require('../controllers/image');

const router = express.Router();

router.get('/search', authValidator, searchController);
router.post('/upload', authValidator, uploadController);


module.exports = router;
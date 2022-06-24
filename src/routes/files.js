const express = require('express');
const multer = require('multer');
const { authValidator } = require('../middlewares/authValidator');
const { listController,
        uploadController,
        downloadController,
        manageController } = require('../controllers/file');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/', authValidator, listController);

router.post('/upload', authValidator, upload.single('file'), uploadController);

router.get('/download', authValidator, downloadController);

router.get('/manage', authValidator, manageController);


module.exports = router;
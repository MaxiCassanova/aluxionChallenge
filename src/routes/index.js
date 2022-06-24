const express = require('express');
const authRouter = require('./auth');
const filesRouter = require('./files');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
router.use('/auth', authRouter);
router.use('/files', filesRouter);


module.exports = router;
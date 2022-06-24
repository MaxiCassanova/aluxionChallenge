const express = require('express');
const authRouter = require('./auth');
const filesRouter = require('./files');
const imageRouter = require('./image');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
router.use('/auth', authRouter);
router.use('/files', filesRouter);
router.use('/image', imageRouter);


module.exports = router;
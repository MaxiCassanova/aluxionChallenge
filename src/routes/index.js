const express = require('express');
const authRouter = require('./auth');
const imageRouter = require('./image');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
router.use('/auth', authRouter);
router.use('/images', imageRouter);

module.exports = router;
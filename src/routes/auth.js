const express = require('express');

const { registerController, 
        loginController, 
        githubLoginController, 
        githubCallbackController,
        restorePasswordController,
        changePasswordController,
        resetPasswordController } = require('../controllers/auth');
        
const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.post('/login/github', githubLoginController);

router.post('/github/callback', githubCallbackController);

router.post('/restore', restorePasswordController);

router.post('/change', changePasswordController);

router.get('/reset/:token', resetPasswordController);

module.exports = router;
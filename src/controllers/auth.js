const Users = require('../db/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { createTemplate } = require('../templates/createTemplate');
const { sendEmail } = require('./email');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const saltOrRounds = 10;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;



const registerController = async (req, res) => {
    try{
        const userFlag = await Users.exists({email: req.body.email});
        if(userFlag) {
            return res.status(400).json({message: 'Email already exists'});
        }
        let userData = {
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, saltOrRounds)
        }
        const user = await Users.create(userData);
        if(!user) {
            return res.status(400).json({message: 'An error has ocurred while creating the user'});
        }
        user.password = undefined;
        return res.status(200).json({user: user});
    } catch(e) {
        return res.status(500).json({message: 'Something went wrong'});
    }
}

const loginController = async (req, res) => {
    try{
        const userFlag = await Users.exists({email: req.body.email});
        let user;
        if(userFlag) {
            user = await Users.findOne({email: req.body.email});
        }else{
            res.status(400).json({message: 'Email or password incorrect'});
        }
        if(user) {
            const passwordFlag = await bcrypt.compare(req.body.password, user.password)
            if(!passwordFlag) {
                return res.status(400).json({message: 'Email or password incorrect'});
            }
            const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRATION});
            res.status(200).json({token: token});
        }
    } catch(e) {
        res.status(500).json({message: 'Something went wrong'});
    }
}

const restorePasswordController = async (req, res) => {
    try{
        let flag = await Users.exists({email: req.body.email});
        if(!flag) {
            return res.status(400).json({message: 'Email does not exist'});
        }
        const user = await Users.findOne({email: req.body.email});
        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRATION});
        const email = {
            to: user.email,
            subject: 'Restore password',
            html: await createTemplate('restorePassword.ejs', { token: token }),
        }
        let emailFlag = await sendEmail(email.to, email.subject, email.html);
        if(!emailFlag) {
            return res.status(400).json({message: 'An error has ocurred while sending the email'});
        }

        res.status(200).json({message: 'Email sent'});
    } catch(e) {
        return res.status(500).json({message: e.message});
    }
}

const changePasswordController = async (req, res) => {
    try{
        const token = req.query.token;
        console.log(token);
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded) {
            return res.status(400).json({message: 'Token invalid'});
        }
        let user = await Users.findById(decoded.id);
        user.password = await bcrypt.hash(req.body.password, saltOrRounds);
        await user.save();
        res.status(200).json({message: 'Password changed'});
    }
    catch(e) {
        return res.status(500).json({message: e.message});
    }
}

const githubLoginController = async (req, res) => {
    try{
        const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`
        return res.status(200).json({url: url});
    } catch(e) {
        return res.status(500).json({message: 'Something went wrong'});
    }
}

const githubCallbackController = async (req, res) => {
    try{
        const { code } = req.query;
        let githubResponse = await axios({
            url: `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
            headers: {
                Accept: 'application/json'
            },
        })
        if(!githubResponse.data) {
            return res.status(400).json({message: githubResponse.data.error});
        }

        githubVerify = await axios({
            //url: `https://api.github.com/user?access_token=${githubResponse.data.access_token}`,
            url: 'https://api.github.com/user/public_emails',
            headers: {
                Accept: 'application/json',
                Authorization: `token ${githubResponse.data.access_token}`
            }
        })
        if(!githubVerify.data) {
            return res.status(400).json({message: githubVerify.data.error});
        }
        let user;
        let i;
        for(i = 0; i < githubVerify.data.length; i++) {
            if(githubVerify.data[i].primary) {
                user = await Users.exists({email: githubVerify.data[i].email});
                break;
            }
        }
        if(!user) {
            // if user does not exist, create a new one
            let userData = {
                email: githubVerify.data[i].email,
                password: await bcrypt.hash(githubVerify.data[i].email, saltOrRounds)
            }
            user = await Users.create(userData);
        }
        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRATION});
        return res.status(200).json({token: token});
    } catch(e) {
        return res.status(500).json({message: 'Something went wrong'});
    }
}

module.exports = {
    registerController,
    loginController,
    restorePasswordController,
    changePasswordController,
    githubLoginController,
    githubCallbackController
}




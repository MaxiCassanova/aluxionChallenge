const Users = require('../db/models/user');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


const authValidator = async (req, res, next) => {
    try{
        if(!req.headers.authorization){
            return res.status(401).send('No token provided');
        }
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({message: 'Invalid token'});
        }
        const user = await Users.findById(decoded.id);
        if(!user) {
            return res.status(400).json({message: 'User not found'});
        }
        req.localUser = user;
        next();
    } catch(e) {
        return res.status(500).json({message: e.message});
    }
}

module.exports = {authValidator};

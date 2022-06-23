const mongoose = require('mongoose');

//crear el modelo para user, que reciba un email unique y una contraseña

const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: [true, 'The email is required'],
        },
        password: {
            type: String,
            required: [true, 'The password is required']
        }
    }, {timestamps: true}
);

const Users = mongoose.model('Users', userSchema);

module.exports = Users;




const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, // white spaces will be removed from both sides of the string
        required: true,
        max: 32,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        },
    },
    hashed_password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordLink: {
        data: String,
        default: '',
    },
}, {
    timestamp: true,
});

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, '2313123123121vdsfdsgsd58***a+', {
        expiresIn: '2h'
    })

    user.tokens = user.tokens.concat({
        token
    })
    await user.save()

    return token

}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email: email,
    });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// Hash the password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('hashed_password')) {
        user.hashed_password = await bcrypt.hash(user.hashed_password, 10);
    }

    next();
});

/* 
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    }
*/

const User = mongoose.model('User', userSchema);

module.exports = User;
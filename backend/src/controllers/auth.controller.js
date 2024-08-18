const httpStatus = require('http-status');
const catchAsync = require("../utils/catchAsync");
const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

//generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30d'});
}

//Register User
const registerUser = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;

    const user = await authService.createUser({ username, email, password });
    const token = generateToken(user._id);

    res.status(httpStatus.CREATED).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
    });
});

//Login User
const loginUser = catchAsync(async (req, res) => {
    const {email, password } = req.body;
    const user = await authService.loginUser({email, password});
    const token = generateToken(user._id);

    res.status(httpStatus.Ok).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
    })
})

module.exports = {
    registerUser,
    loginUser
}


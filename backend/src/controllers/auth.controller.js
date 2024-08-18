const httpStatus = require('http-status');
const catchAsync = require("../utils/catchAsync");
const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

//generate JWT
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30d'});
// }
const tokenTypes = {
    ACCESS: "access",
    REFRESH: "refresh",
    RESET_PASSWORD: "resetPassword",
  };

  const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
    console.log("process.env.JWT_SECRET)", secret)
    const payload = {
      sub: userId,
      type: type,
      exp: expires,
      iat:Date.now()/1000,
    };
    const jwtToken = jwt.sign(payload, secret);
    return jwtToken;
  };
  
const generateAuthTokens = async (user) => {
    const expires = Math.floor(Date.now()/1000) + 240 * 60 ;
    const accessToken = generateToken(user._id, expires ,tokenTypes.ACCESS)
    return {  
        token:accessToken,
        expires:new Date(expires * 1000)
      }
  };
//Register User
const registerUser = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await authService.createUser({ username, email, password });
    res.status(httpStatus.CREATED).json({
        _id: user._id,
        username: user.username,
        email: user.email,
    });
});

//Login User
const loginUser = catchAsync(async (req, res) => {
    const {email, password } = req.body;
    const user = await authService.loginUser(email, password);
    const token = await generateAuthTokens(user);
    res.status(httpStatus.OK).json({
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


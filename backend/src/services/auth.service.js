const User = require("../models/user.model");
const httpStatus = require("http-status");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");

const getUserByEmail = async (email) => {
  return User.findOne(email);
};

const createUser = async (user) => {
  const { username, email, password } = user;
  const userExists = await getUserByEmail(email);

  if (userExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  return createUser;
};

//login user function
const loginUser = async(email, password) => {
    let user = await getUserByEmail(email);

    if(!user || !(await User.isPasswordMatch(password))){
        throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password")
    }

    return user
}

module.exports = {
  createUser,
  loginUser
};

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            default: ""
        },
        email: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          lowercase: true,
          validate: (value) => validator.isEmail(value)
        },
        password: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                  throw new Error(
                    "Password must contain at least one letter and one number"
                  );
                }
              },
        },
        projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] //Array of projects
    }, {timestamps: true});

    UserSchema.methods.isPasswordMatch = async function (enteredPassword){
        let checkPassword = await bcrypt.compare(enteredPassword, this.password);
        return checkPassword;
    };

    module.exports = mongoose.model('Users', UserSchema)
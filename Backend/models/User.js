const mongoose = require('mongoose');
const validator = require('validator');

// Define a sub-schema for local authentication
const AuthLocalSchema = new mongoose.Schema({
  password: {
    type: String,
    // Use a custom required function:
    // The password is required if there is no Google ID.
    required: function () {
      // 'this' in this subdocument refers to the AuthLocalSchema instance.
      // To check the sibling google field, we get the parent.
      const parent = this.parent();
      return !(parent.google && parent.google.id);
    }
  }
}, { _id: false });

// Define a sub-schema for Google authentication (if any)
const AuthGoogleSchema = new mongoose.Schema({
  id: { type: String }
}, { _id: false });

// Define an authentication schema to encapsulate both local and google methods.
const AuthSchema = new mongoose.Schema({
  local: {
    type: AuthLocalSchema,
    default: {}
  },
  google: {
    type: AuthGoogleSchema,
    default: {}
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: props => `${props.value} is not a valid email address!`
    }
  },
  name: { 
    type: String 
  },
  auth: {
    type: AuthSchema,
    default: {}
  },
  profilePicture: {
    data: Buffer,
    contentType: String  // No image by default
  },
  dietaryPreferences: {
    type: [String],
    default: [],
    validate: [val => val.length <= 10, '{PATH} exceeds the limit of 10']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

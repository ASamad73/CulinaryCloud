const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function(v) {
        return validator.isEmail(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
  },
  // New field: Profile picture stored as a buffer (binary data)
  profilePicture: {
    data: Buffer,
    contentType: String  // No image by default
  },
  // New field: Dietary preferences (array of strings)
  dietaryPreferences: {
    type: [String],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10']
  }
});

// Custom validator for the dietary preferences limit
function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('User', UserSchema);

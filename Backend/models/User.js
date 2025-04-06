const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // ✅ New field: Profile picture URL (string for now)
  profilePicture: {
    type: String,
    default: '' // or you can set a default avatar image URL
  },

  // ✅ New field: Dietary preferences (array of strings)
  dietaryPreferences: {
    type: [String],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10']
  }
});

// Custom validator for the preferences limit
function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('User', UserSchema);

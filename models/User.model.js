const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    role: {
      type: String,
      enum: ['BOSS', 'TA', 'STUDENT', 'DEV', 'GUEST'],
      default: 'GUEST',
    },
    name: String,
    password: String,
    profileImg: String,
    description: String,
    facebookId: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

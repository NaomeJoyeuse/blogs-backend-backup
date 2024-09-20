
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
   name: {
     type: String,
     required: true,
   },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
      type: String,
      enum: ['admin', 'user'], 
      default: 'user', 
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);
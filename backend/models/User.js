const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "company"],
    default: "user",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving the user
// UserSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//       return next();
//     }
  
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   });
  
//   // Generate a JWT for authentication
//   UserSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign(
//       { _id: this._id, isAdmin: this.isAdmin },
//       process.env.JWT_SECRET, // Replace with your secret private key
//     );
//     return token;
//   };

module.exports = User = mongoose.model("User", UserSchema);

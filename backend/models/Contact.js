const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: [500, "Description cannot be longer than 500 characters"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  identifiers: {
    isAdmin: {
      type: Boolean,
      default: false,
    },
    alt_id: {
      type: String,
      default: () => uuidv4().replace(/-/g, ""),
    },
    resource_id: {
      type: String,
      required: false,
    },
  },
});

ContactSchema.pre("save", function (next) {
  console.log("alt_id before:", this.identifiers.alt_id);

  // Ensure SECRET_KEY is properly set and has a length of 64 characters
  const secretKey = Buffer.from(process.env.SECRET_KEY, 'utf-8');
  if (!secretKey || secretKey.length !== 32) {
    throw new Error("Invalid SECRET_KEY");
  }

  // Generate a random IV
  const iv = crypto.randomBytes(16);

  // Create a cipher using AES-256-CBC algorithm
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    secretKey,
    iv
  );

  // Encrypt the "666" string
  let encrypted666 = cipher.update("666", "utf8", "hex");
  encrypted666 += cipher.final("hex");

  // Update resource_id using the encrypted "666" string
  this.identifiers.resource_id =
    this.identifiers.alt_id.slice(0, -4) +
    encrypted666 +
    this.identifiers.alt_id.slice(-4);

  console.log("alt_id after:", this.identifiers.alt_id);
  console.log("resource_id:", this.identifiers.resource_id);

  next();
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
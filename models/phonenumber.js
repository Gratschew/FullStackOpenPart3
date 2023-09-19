const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
function validatePhoneNumber(value) {
  const parts = value.split("-");

  if (parts.length !== 2) {
    return false;
  }

  const firstPart = parts[0];
  const secondPart = parts[1];

  // Check if the first part contains 2 or 3 digits
  if (firstPart.length < 2 || firstPart.length > 3) {
    return false;
  }
  if (secondPart.length + firstPart.length < 8) return false;

  // Check if the second part contains only digits
  if (!/^\d+$/.test(secondPart)) {
    return false;
  }

  return true;
}
const phoneNumberSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: {
    type: String,
    required: true,
    validate: {
      validator: validatePhoneNumber,
      message: "Phone number is invalid",
    },
  },
  important: Boolean,
});

phoneNumberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonebook", phoneNumberSchema);

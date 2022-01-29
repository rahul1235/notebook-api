const Validator = require("fastest-validator");

const validatorObject = new Validator({ useNewCustomCheckerFunction: true });
const User = require("./models/User");

const createUserSchema = validatorObject.compile({
  $$async: true,
  name: "string|trim|min:3",
  email: {
    type: "email",
    trim: true,
    custom: async (value, errors) => {
      const checkUser = await User.findOne({
        email: value,
      });
      if (checkUser) {
        errors.push({
          type: "unique",
          message: "must be unique",
          actual: value,
        });
      }
      return value;
    },
  },
  password: "string|min:5|max:20|trim",
  confirmPassword: "equal|field:password|trim",
});

const loginSchema = validatorObject.compile({
  email: "email|trim",
  password: "string|min:5|max:20|trim",
});

const createNotesSchema = validatorObject.compile({
  title: "string|min:3|max:100|trim",
  description: "string|min:5|max:500|trim",
  tag: "string|min:3|max:20|trim|optional",
});

module.exports = {
  createUserSchema,
  loginSchema,
  createNotesSchema,
};

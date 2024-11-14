const jwt = require("jsonwebtoken");
const { signupschema } = require("../middlerwares/validator");
const User = require("../models/userModel");
const { doHash, doHashValidation } = require("../utils/hasing");

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { errors, values } = signupschema.validate({ email, password });
    if (errors)
      return res.status(401).json({ success: false, message: errors });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(401)
        .json({ success: false, message: "User is already exists" });
    const hashPassword = await doHash(password, 12);
    const newUser = new User({
      email,
      password: hashPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res
      .status(201)
      .json({ success: "true", message: "User saved successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  const { errors, values } = signupschema.validate({ email, password });
  if (errors) return res.status(401).json({ success: false, message: errors });

  const existingUser = await User.findOne({ email }).select('+password');
  if (!existingUser)
    return res
      .status(401)
      .json({ success: false, message: "User doesn't exists" });
  const result = await doHashValidation(password, existingUser.password);
  if (!result)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  const token = jwt.sign(
    {
      email: existingUser.email,
      userId: existingUser._id,
      verified: existingUser.verified,
    },
    process.env.TOKEN_SECRET
  );

  res.cookie("Authorization", "Bearer " + token, {
    expires: new Date(Date.now() + 8 * 36000000),
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
  }).json({
    success: true,
    message: "User signed in successfully",
    token,
    userId: existingUser._id,
    verified: existingUser.verified,
    email: existingUser.email,
    name: existingUser.name,
    phone: existingUser.phone,
    address: existingUser.address,
    profileImage: existingUser.profileImage,
    role: existingUser.role,
    verifiedPassword: existingUser.verifiedPassword,
    verificationCode: existingUser.verificationCode,
    verificationCodeValidation: existingUser.verificationCodeValidation,
    createdAt: existingUser.createdAt,
    updatedAt: existingUser.updatedAt,
    __v: existingUser.__v,
    _id: existingUser._id,
    __t: existingUser.__t,
    _doc: existingUser._doc,
    _schema: existingUser._schema,
    _id: existingUser._id,
    _schema: existingUser._schema,
  });
};

import { BadRequestError } from '../errors/customError.js';
import jwt from 'jsonwebtoken';
import {
  sendResetCodeFunction,
  sendVerificationEmailFunction,
} from '../helpers/mailer.js';
import { createToken } from '../helpers/tokens.js';
import { validateEmail, validateLength } from '../helpers/validations.js';
import { generateCode } from '../helpers/generateCode.js';

import User from '../model/UserModel.js';
import Code from '../model/CodeModel.js';
import bcrypt from 'bcryptjs';

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const isFirstUser = (await User.countDocuments()) === 0;
  let role = isFirstUser ? 'admin' : 'user';
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please enter a name, email and password',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Please enter a valid email address',
      });
    }
    const userAlreadyRegistered = await User.findOne({ email });
    if (userAlreadyRegistered) {
      return res.status(400).json({
        message: 'User already exist with this email address',
      });
    }

    if (!validateLength(name, 3, 50)) {
      return res.status(400).json({
        message: 'name length must be between 3 and 50 characters',
      });
    }
    if (!validateLength(password, 5, 50)) {
      ('Password length must be between 5 and 50 characters');
      return res.status(400).json({
        message: 'Password length must be between 5 and 50 characters',
      });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    }).save();

    const token = createToken(
      { userId: newUser._id, role: userUser.role },
      '7d'
    );
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + oneDay),
    });
    const emailVerificationToken = createToken({ userId: newUser._id }, '5d');
    const url = `${process.env.FRONTEND_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmailFunction(newUser.email, newUser.name, url);

    return res.status(201).json({
      message:
        'Account created! check your email to activate and continue. The verification link will expire in five(5) days.',
    });
  } catch (error) {
    console.log(error);
    return response.status(400).json({ message: error });
  }
};

// Login Functionality
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'No account found with email provided.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    const token = createToken({ userId: user._id, role: user.role }, '7d');
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + oneDay),
    });
    return res.status(200).json({
      message: 'Login successful.',
    });
  } catch (error) {
    console.log(error);
    return response.status(400).json({ message: error });
  }
};

// Find User Controller
const findUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: 'Please provide email',
    });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    return res.status(200).json({
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.image,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'No account found with email provided.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    const isAdmin = user.role === 'admin' ? true : false;
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to access this route' });
    }

    const token = createToken({ userId: user._id, role: user.role }, '7d');
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + oneDay),
    });
    return res.status(200).json({
      message: 'Login successful.',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: 'Please provide your email address' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '-password'
    );
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    await Code.findOneAndDelete({ user: user._id });
    const code = generateCode(5);
    const savedCode = await new Code({
      code,
      user: user._id,
    }).save();
    sendResetCodeFunction(user.email, user.name, code);
    return res.status(200).json({
      message: 'Password reset code has been sent to your email',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: 'Verification code is wrong...',
      });
    }
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: 'Please go back to find your account.' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Please enter your new password' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const salt = await bcrypt.genSalt(12);

  const cryptedPassword = await bcrypt.hash(password, salt);
  await User.findOneAndUpdate(
    { email },
    {
      password: cryptedPassword,
    }
  );
  return res.status(200).json({ message: 'success' });
};

const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(200).json({
    message: 'Logout successful.',
  });
};

const activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const validUser = req.user.userId;

    const payload = jwt.verify(token, process.env.CREATE_TOKEN_SECRET);
    const user = await User.findOne({ _id: payload.userId }).select(
      '-password'
    );
    if (validUser !== payload.userId) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
      });
    }
    if (user.emailVerified === true) {
      return res.status(400).json({
        message: 'Email has already been verified',
      });
    } else {
      user.emailVerified = true;
      await user.save();
      return res.status(200).json({
        message: 'Email has been verified',
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export {
  registerUser,
  loginUser,
  findUser,
  activateAccount,
  adminLogin,
  logout,
  sendResetPasswordCode,
  validateResetCode,
  changePassword,
};

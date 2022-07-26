import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Sign Up
export const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isUsed = await User.findOne({ username });

    if (isUsed) return res.json({ message: 'This username is already exists' });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, password: hash });

    await newUser.save();

    res.json({
      user: newUser,
      message: 'Sign up completed successfully',
    })
  } catch (e) {
    res.status(500).json({ message: 'There is a user creation error' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.json({ message: 'User not found' });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return res.json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user,
      message: 'Login successful'
    });
  } catch (e) {
    res.status(500).json({ message: 'Authorization error' });
  }
};

// Login
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.json({ message: 'User not found' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ user, token });
  } catch (e) {
    res.status(403).json({ message: 'Access denied' });
  }
};
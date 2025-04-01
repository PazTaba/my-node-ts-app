import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  User  from '../models/User';

const router = express.Router();

router.post('/register', async (req:any, res:any) => {
  try {
    const { name, email, password, location, phoneNumber, age, gender } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name, email, password: hashedPassword,
      location: { latitude: location?.latitude, longitude: location?.longitude },
      phoneNumber, age, gender,
      registrationDate: new Date(),
      lastActiveDate: new Date(),
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, gender, age }
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: 'Registration error' });
  }
});

router.post('/login', async (req:any, res:any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '30d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Login error' });
  }
});

export default router;

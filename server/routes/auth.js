const r = require('express').Router(), bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, wrap } = require('../middleware/auth');
const pack = u => ({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }), user: { id: u._id, name: u.name, email: u.email } });

r.post('/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email || !password || password.length < 6)
    return res.status(400).json({ message: 'Name, email and a password of at least 6 characters are required' });
  const d = process.env.COLLEGE_EMAIL_DOMAIN;
  if (d && !email.toLowerCase().endsWith('@' + d)) return res.status(400).json({ message: `Please use your college email (@${d})` });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists' });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 10) });
  res.status(201).json(pack(user));
}));

r.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = email && password && await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Incorrect email or password' });
  res.json(pack(user));
}));

r.get('/me', auth, (req, res) => res.json({ id: req.user._id, name: req.user.name, email: req.user.email }));
module.exports = r;

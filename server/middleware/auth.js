const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.auth = exports.wrap(async (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  let id;
  try { id = jwt.verify(token, process.env.JWT_SECRET).id; }
  catch { return res.status(401).json({ message: 'Please log in to continue' }); }
  const user = await User.findById(id).select('-passwordHash');
  if (!user) return res.status(401).json({ message: 'Account not found' });
  req.user = user;
  next();
});

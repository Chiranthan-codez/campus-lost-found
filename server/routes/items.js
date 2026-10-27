const r = require('express').Router(), path = require('path'), fs = require('fs'), multer = require('multer');
const Item = require('../models/Item'), Claim = require('../models/Claim');
const { auth, wrap } = require('../middleware/auth');
const dir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(dir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({ destination: dir, filename: (q, f, cb) => cb(null, Date.now() + path.extname(f.originalname)) }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (q, f, cb) => /^image\//.test(f.mimetype) ? cb(null, true) : cb(Object.assign(new Error('Only image files are allowed'), { status: 400 })),
});
const FIELDS = ['title', 'type', 'category', 'description', 'location', 'date'];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

r.get('/', wrap(async (req, res) => {
  const { q, category, type, limit } = req.query, f = {};
  if (q) f.title = new RegExp(esc(q), 'i');
  if (category) f.category = category;
  if (type) f.type = type;
  res.json(await Item.find(f).sort('-createdAt').limit(Math.min(+limit || 100, 100)).populate('userId', 'name'));
}));

r.get('/mine', auth, wrap(async (req, res) => res.json(await Item.find({ userId: req.user._id }).sort('-createdAt'))));

r.get('/:id', wrap(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('userId', 'name');
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
}));

r.post('/', auth, upload.single('image'), wrap(async (req, res) => {
  const data = { userId: req.user._id };
  FIELDS.forEach(k => data[k] = req.body[k]);
  if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
  res.status(201).json(await Item.create(data));
}));

async function ownItem(req, res) {
  const item = await Item.findById(req.params.id);
  if (!item) { res.status(404).json({ message: 'Item not found' }); return null; }
  if (!item.userId.equals(req.user._id)) { res.status(403).json({ message: 'You can only change your own reports' }); return null; }
  return item;
}

r.patch('/:id', auth, upload.single('image'), wrap(async (req, res) => {
  const item = await ownItem(req, res); if (!item) return;
  FIELDS.forEach(k => { if (req.body[k] !== undefined) item[k] = req.body[k]; });
  if (req.body.status === 'RETURNED') item.status = 'RETURNED';
  if (req.file) item.imageUrl = '/uploads/' + req.file.filename;
  await item.save();
  res.json(item);
}));

r.delete('/:id', auth, wrap(async (req, res) => {
  const item = await ownItem(req, res); if (!item) return;
  await Claim.deleteMany({ itemId: item._id });
  await item.deleteOne();
  res.json({ message: 'Report deleted' });
}));

r.get('/:id/claims', auth, wrap(async (req, res) => {
  const item = await ownItem(req, res); if (!item) return;
  res.json(await Claim.find({ itemId: item._id }).sort('-createdAt').populate('claimantId', 'name email'));
}));

r.post('/:id/claims', auth, wrap(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.type !== 'FOUND') return res.status(400).json({ message: 'Claims can only be made on found items' });
  if (item.userId.equals(req.user._id)) return res.status(400).json({ message: 'You cannot claim your own listing' });
  if (item.status === 'RETURNED') return res.status(400).json({ message: 'This item has already been returned' });
  if (await Claim.findOne({ itemId: item._id, claimantId: req.user._id })) return res.status(409).json({ message: 'You have already submitted a claim for this item' });
  const claim = await Claim.create({ itemId: item._id, claimantId: req.user._id, message: req.body.message });
  if (item.status === 'OPEN') { item.status = 'CLAIM_PENDING'; await item.save(); }
  res.status(201).json(claim);
}));
module.exports = r;

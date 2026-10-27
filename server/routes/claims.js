const r = require('express').Router();
const Claim = require('../models/Claim'), Item = require('../models/Item');
const { auth, wrap } = require('../middleware/auth');

r.get('/my', auth, wrap(async (req, res) =>
  res.json(await Claim.find({ claimantId: req.user._id }).sort('-createdAt').populate('itemId', 'title type status'))));

r.patch('/:claimId', auth, wrap(async (req, res) => {
  const { status } = req.body;
  if (!['ACCEPTED', 'REJECTED'].includes(status)) return res.status(400).json({ message: 'Status must be ACCEPTED or REJECTED' });
  const claim = await Claim.findById(req.params.claimId);
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  const item = await Item.findById(claim.itemId);
  if (!item || !item.userId.equals(req.user._id)) return res.status(403).json({ message: 'Only the listing owner can review claims' });
  if (claim.status !== 'PENDING') return res.status(400).json({ message: 'This claim has already been reviewed' });
  claim.status = status;
  await claim.save();
  if (status === 'ACCEPTED') {
    await Claim.updateMany({ itemId: item._id, status: 'PENDING' }, { status: 'REJECTED' });
    if (item.status !== 'RETURNED') { item.status = 'CLAIM_PENDING'; await item.save(); }
  } else if (item.status === 'CLAIM_PENDING' && !(await Claim.exists({ itemId: item._id, status: { $in: ['PENDING', 'ACCEPTED'] } }))) {
    item.status = 'OPEN'; await item.save();
  }
  res.json(claim);
}));
module.exports = r;

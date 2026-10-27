const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { connectDB } = require('./db');
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

const target = (process.argv[2] || 'all').toLowerCase();

(async () => {
  await connectDB();

  if (target === 'users' || target === 'all') {
    const users = await User.find({}, '-passwordHash').lean();
    console.log('\n=== USERS (' + users.length + ') ===');
    console.table(users.map(u => ({ id: u._id.toString(), name: u.name, email: u.email })));
  }

  if (target === 'items' || target === 'all') {
    const items = await Item.find({}, 'title type category status location imageUrl').lean();
    console.log('\n=== ITEMS (' + items.length + ') ===');
    console.table(items.map(it => ({
      id: it._id.toString().slice(-6),
      title: it.title,
      type: it.type,
      category: it.category,
      status: it.status,
      location: it.location,
      image: it.imageUrl || '(none)'
    })));
  }

  if (target === 'claims' || target === 'all') {
    const claims = await Claim.find().populate('itemId', 'title').populate('claimantId', 'name email').lean();
    console.log('\n=== CLAIMS (' + claims.length + ') ===');
    if (claims.length === 0) {
      console.log('(No claims found)');
    } else {
      console.table(claims.map(c => ({
        id: c._id.toString().slice(-6),
        item: c.itemId?.title || 'Unknown',
        claimant: c.claimantId?.name || 'Unknown',
        status: c.status
      })));
    }
  }

  process.exit(0);
})();

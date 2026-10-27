const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose'), bcrypt = require('bcryptjs');
const User = require('./models/User'), Item = require('./models/Item'), Claim = require('./models/Claim');
const { connectDB } = require('./db');
(async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Item.deleteMany(), Claim.deleteMany()]);
  const passwordHash = await bcrypt.hash('password123', 10);
  const [a, b] = await User.create([{ name: 'Asha Rao', email: 'asha@college.edu', passwordHash }, { name: 'Ben Thomas', email: 'ben@college.edu', passwordHash }]);
  const d = n => new Date(Date.now() - n * 864e5);
  const items = await Item.create([
    { title: 'Black laptop bag', type: 'LOST', category: 'bags', description: 'Black backpack with a red keychain.', location: 'Library, 2nd floor', date: d(1), imageUrl: '/uploads/backpack.jpg', userId: a._id },
    { title: 'Student ID card', type: 'FOUND', category: 'id cards', description: 'ID card found near the canteen. Name partly worn.', location: 'Canteen', date: d(2), imageUrl: '/uploads/idcard.jpg', userId: b._id },
    { title: 'Casio calculator', type: 'FOUND', category: 'electronics', description: 'Scientific calculator left on a desk.', location: 'Block 5, Room 204', date: d(3), imageUrl: '/uploads/calculator.jpg', userId: a._id },
    { title: 'Car keys', type: 'LOST', category: 'keys', description: 'Key set with a blue bottle-opener fob.', location: 'Parking lot', date: d(4), imageUrl: '/uploads/carkeys.jpg', userId: b._id },
    { title: 'Brown wallet', type: 'FOUND', category: 'wallets', description: 'Leather wallet with no cash inside.', location: 'Sports ground', date: d(5), imageUrl: '/uploads/wallet.jpg', userId: b._id },
    { title: 'Data Structures textbook', type: 'LOST', category: 'books', description: 'Annotated copy with a yellow cover.', location: 'Lecture hall 3', date: d(6), imageUrl: '/uploads/textbook.jpg', userId: a._id },
  ]);
  await Claim.create({ itemId: items[1]._id, claimantId: a._id, message: "Why it's mine: I lost my ID on Monday.\nIdentifying details: Photo shows me with glasses." });
  await Item.findByIdAndUpdate(items[1]._id, { status: 'CLAIM_PENDING' });
  console.log('Seeded. Log in with asha@college.edu or ben@college.edu, password: password123');
  process.exit(0);
})();

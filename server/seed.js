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
    {
      title: 'Black laptop bag',
      type: 'LOST',
      category: 'bags',
      description: 'Water-resistant black canvas laptop backpack with dual side water bottle pockets and a red "EXPLORE MORE" keychain tag.',
      additionalDetails: 'Features a padded 15.6-inch laptop compartment. Inside there is a grey spiral notebook and a USB-C charger. Last seen near study cubicle #12 on the second floor of the main library.',
      location: 'Library, 2nd floor',
      date: d(1),
      imageUrl: '/uploads/backpack.jpg',
      userId: a._id
    },
    {
      title: 'Student ID card',
      type: 'FOUND',
      category: 'id cards',
      description: 'Official university smartcard with magnetic strip, barcode, and student photo.',
      additionalDetails: 'Name text is slightly faded around the last name. Student photo shows a student wearing black wireframe glasses. Currently deposited safely with the canteen manager desk.',
      location: 'Canteen',
      date: d(2),
      imageUrl: '/uploads/idcard.jpg',
      userId: b._id
    },
    {
      title: 'Casio calculator',
      type: 'FOUND',
      category: 'electronics',
      description: 'Casio fx-991EX ClassWiz scientific calculator in black and white casing with snap-on protective cover.',
      additionalDetails: 'The sliding case has a small green circular sticker on the bottom left corner. Working battery with clean LCD screen. Found left on desk #8 after the morning Linear Algebra lecture.',
      location: 'Block 5, Room 204',
      date: d(3),
      imageUrl: '/uploads/calculator.jpg',
      userId: a._id
    },
    {
      title: 'Car keys',
      type: 'LOST',
      category: 'keys',
      description: 'Car key set with a black 3-button remote keyless entry fob and two standard brass door keys.',
      additionalDetails: 'Attached to a blue anodized aluminum bottle-opener keychain with minor surface scuffs. Misplaced around 5:30 PM near the student parking lot rows C/D adjacent to the bicycle racks.',
      location: 'Parking lot',
      date: d(4),
      imageUrl: '/uploads/carkeys.jpg',
      userId: b._id
    },
    {
      title: 'Brown wallet',
      type: 'FOUND',
      category: 'wallets',
      description: 'Vintage bi-fold genuine brown leather wallet with perimeter contrast stitching.',
      additionalDetails: 'No cash inside. Interior slots hold a city metro card and an expired campus sports recreation pass. Turned in after being found on the lower bleacher bench facing the football field.',
      location: 'Sports ground',
      date: d(5),
      imageUrl: '/uploads/wallet.jpg',
      userId: b._id
    },
    {
      title: 'Data Structures textbook',
      type: 'LOST',
      category: 'books',
      description: 'Annotated copy of "Data Structures and Algorithms" with a bright yellow cover and colored sticky notes.',
      additionalDetails: 'Hardcover edition with pink and green sticky tabs marking Chapter 8 (Graph Algorithms) and Chapter 4 (Trees). A handwritten note on the title page reads "CS201 - Section B".',
      location: 'Lecture hall 3',
      date: d(6),
      imageUrl: '/uploads/textbook.jpg',
      userId: a._id
    },
  ]);
  await Claim.create({ itemId: items[1]._id, claimantId: a._id, message: "Why it's mine: I lost my ID on Monday.\nIdentifying details: Photo shows me with glasses." });
  await Item.findByIdAndUpdate(items[1]._id, { status: 'CLAIM_PENDING' });
  console.log('Seeded. Log in with asha@college.edu or ben@college.edu, password: password123');
  process.exit(0);
})();

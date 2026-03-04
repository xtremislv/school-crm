require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Admin    = require('../models/Admin');


async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash('admin123', 12);  // change this password
  await Admin.create({
    name:  'Dr. Ramesh Kumar',
    email: 'admin@yourschool.edu',
    password: hash,
    role:  'principal',
  });
  console.log('✅ Admin seeded!');
  mongoose.disconnect();
}
seed();


// Run with: node scripts/seedAdmin.js

const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const Student  = require('../models/Student');
const Admin    = require('../models/Admin');


// REGISTER — Student
router.post('/register', async (req, res) => {
  try {
    const { studentId, name, email, password, class: cls, rollNo } = req.body;

    if (!studentId || !name || !email || !password || !cls) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hash = await bcrypt.hash(password, 12);

    // Signup form has no rollNo field — always supply a number so validation never fails
    const rollNoValue = (typeof rollNo === 'number' && !Number.isNaN(rollNo)) ? rollNo : 0;

    const student = new Student({
      studentId,
      name,
      email,
      password: hash,
      class: cls,
      rollNo: rollNoValue,
    });
    await student.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// LOGIN — Student or Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;  // role: 'student' | 'admin'

    const user = role === 'admin'
      ? await Admin.findOne({ email })
      : await Student.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    // Shape the user object to match what the frontend expects
    const base = user.toObject();
    delete base.password;

    const responseUser = {
      ...base,
      // expose _id as id for the frontend dashboard
      id: base.studentId || base._id?.toString(),
      avatar: base.name
        ? base.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : undefined,
    };

    res.json({ token, user: responseUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const Student = require('../models/Student');

// GET /api/students
// Return all students (without passwords)
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/:id
// Used by frontend getStudent(studentId) where id is Mongo _id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: 'Invalid student id' });
  }
});

// POST /api/students
// Create a new student. If no password is provided, default to "student123".
router.post('/', async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      password,
      class: cls,
      rollNo,
      gender,
      phone,
      guardian,
      status,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password || 'student123', 12);

    const student = new Student({
      studentId,
      name,
      email,
      password: hashedPassword,
      class: cls,
      // Ensure rollNo is always a valid number so validation can never
      // fail on this field even if an older schema still marks it required.
      rollNo: typeof rollNo === 'number' && !Number.isNaN(rollNo) ? rollNo : 0,
      gender,
      phone,
      guardian,
      status,
    });

    await student.save();

    const safeStudent = student.toObject();
    delete safeStudent.password;

    res.status(201).json(safeStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/students/:id
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    // Map "class" from body if sent as cls
    if (typeof updates.class === 'undefined' && typeof updates.cls !== 'undefined') {
      updates.class = updates.cls;
      delete updates.cls;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

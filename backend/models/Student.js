const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId:   { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  class:       { type: String, required: true },
  // Signup UI does not collect rollNo — always optional, default 0
  rollNo:      { type: Number, required: false, default: 0 },
  gender:      { type: String, enum: ['M', 'F'] },
  phone:       { type: String },
  guardian:    { type: String },
  status:      { type: String, default: 'active', enum: ['active', 'warning', 'critical'] },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', StudentSchema);

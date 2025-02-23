const router = require('express').Router();
const Attendance = require('../models/Attendance');

// 기업별 출석 기록 조회
router.get('/company/:companyId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ companyId: req.params.companyId })
      .populate('memberId')
      .sort({ timestamp: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 출석 체크
router.post('/', async (req, res) => {
  const attendance = new Attendance({
    memberId: req.body.memberId,
    companyId: req.body.companyId
  });

  try {
    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 
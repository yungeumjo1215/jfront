const router = require('express').Router();
const Member = require('../models/Member');

// 기업별 회원 조회
router.get('/company/:companyId', async (req, res) => {
  try {
    const members = await Member.find({ companyId: req.params.companyId });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 회원 추가
router.post('/', async (req, res) => {
  const member = new Member({
    companyId: req.body.companyId,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber
  });

  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 
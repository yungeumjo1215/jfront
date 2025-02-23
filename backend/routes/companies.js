const router = require('express').Router();
const Company = require('../models/Company');

// 모든 기업 조회
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기업 추가
router.post('/', async (req, res) => {
  const company = new Company({
    name: req.body.name,
    logo: req.body.logo
  });

  try {
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 기업 수정
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(company);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 
const JobSignal = require('../models/JobSignal');

// Get job signals with search and filter
exports.getJobSignals = async (req, res) => {
  try {
    const { sector, locationDistrict, search } = req.query;
    const filter = {};
    if (sector && sector !== 'All') filter.sector = sector;
    if (locationDistrict && locationDistrict !== 'All') filter.locationDistrict = locationDistrict;
    if (search) {
      filter.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } }
      ];
    }

    const signals = await JobSignal.find(filter).sort({ postedDate: -1 }).limit(50);
    res.json({ success: true, count: signals.length, data: signals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Aggregate top skills by sector
exports.getTopSkillsBySector = async (req, res) => {
  try {
    const { sector } = req.query;
    const match = sector && sector !== 'All' ? { sector } : {};

    const topSkills = await JobSignal.aggregate([
      { $match: match },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 }, avgSalary: { $avg: '$avgSalaryLPA' } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    res.json({ success: true, data: topSkills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

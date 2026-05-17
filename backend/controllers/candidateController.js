const Candidate = require('../models/Candidate');

// POST /api/candidates — Add a candidate
const addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;

    const existing = await Candidate.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'A candidate with this email already exists.' });
    }

    const candidate = await Candidate.create({ name, email, skills, experience, bio });
    res.status(201).json({ message: 'Candidate added successfully', candidate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/candidates — Get all candidates
const getAllCandidates = async (req, res) => {
  try {
    const { search, skill } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/candidates/:id — Delete a candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addCandidate, getAllCandidates, deleteCandidate };

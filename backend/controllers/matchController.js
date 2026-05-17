const Candidate = require('../models/Candidate');

// POST /api/match — Shortlist candidates with basic logic
const matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ error: 'requiredSkills must be a non-empty array.' });
    }

    const minExp = minExperience || 0;

    // Fetch all candidates meeting the minimum experience threshold
    const candidates = await Candidate.find({ experience: { $gte: minExp } });

    const normalizedRequired = requiredSkills.map((s) => s.toLowerCase());
    const normalizedPreferred = (preferredSkills || []).map((s) => s.toLowerCase());

    const ranked = candidates
      .map((candidate) => {
        const candidateSkills = candidate.skills.map((s) => s.toLowerCase());

        const matchedRequired = normalizedRequired.filter((s) => candidateSkills.includes(s));
        const matchedPreferred = normalizedPreferred.filter((s) => candidateSkills.includes(s));

        const requiredScore = matchedRequired.length / normalizedRequired.length;
        const preferredBonus =
          normalizedPreferred.length > 0
            ? matchedPreferred.length / normalizedPreferred.length * 0.2
            : 0;

        const totalScore = Math.min(1, requiredScore + preferredBonus);

        let tier;
        if (requiredScore >= 0.75) tier = 'High';
        else if (requiredScore >= 0.4) tier = 'Medium';
        else tier = 'Low';

        return {
          _id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          skills: candidate.skills,
          experience: candidate.experience,
          bio: candidate.bio,
          matchedSkills: matchedRequired,
          matchedPreferred: matchedPreferred,
          matchScore: Math.round(totalScore * 100),
          requiredMatchScore: Math.round(requiredScore * 100),
          tier,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({ results: ranked, total: ranked.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { matchCandidates };

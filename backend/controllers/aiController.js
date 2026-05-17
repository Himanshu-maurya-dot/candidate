const fetch = require('node-fetch');
const Candidate = require('../models/Candidate');

// POST /api/ai/shortlist — AI-based candidate shortlisting via OpenRouter
const aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ error: 'requiredSkills must be a non-empty array.' });
    }

    const minExp = minExperience || 0;
    const candidates = await Candidate.find({ experience: { $gte: minExp } });

    if (candidates.length === 0) {
      return res.json({ results: [], message: 'No candidates meet the minimum experience criteria.' });
    }

    // Build the candidate list string for the prompt
    const candidateList = candidates
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} — Skills: ${c.skills.join(', ')} — Experience: ${c.experience} year(s)${c.bio ? ` — Bio: ${c.bio}` : ''}`
      )
      .join('\n');

    const prompt = `You are an expert technical recruiter. Rank the following candidates for a job and explain your reasoning.

Job Requirements:
- Required Skills: ${requiredSkills.join(', ')}
- Minimum Experience: ${minExp} year(s)
${preferredSkills && preferredSkills.length > 0 ? `- Preferred Skills: ${preferredSkills.join(', ')}` : ''}

Candidates:
${candidateList}

For each candidate provide:
1. A rank (1 = best fit)
2. A match score out of 100
3. A brief explanation of why they are or are not a good fit

Respond ONLY with a valid JSON array (no markdown, no extra text) in this format:
[
  {
    "rank": 1,
    "candidateIndex": 1,
    "name": "Candidate Name",
    "matchScore": 90,
    "recommendation": "Strong fit because...",
    "strengths": ["skill1", "skill2"],
    "gaps": ["missing_skill"]
  }
]`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured on the server.' });
    }

    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o';

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errBody = await aiResponse.text();
      return res.status(502).json({ error: `OpenRouter API error: ${aiResponse.status}`, details: errBody });
    }

    const aiData = await aiResponse.json();
    const rawText = aiData.choices?.[0]?.message?.content || '';

    // Strip any markdown code fences and parse JSON
    const clean = rawText.replace(/```json|```/g, '').trim();
    let aiRankings;
    try {
      aiRankings = JSON.parse(clean);
    } catch {
      return res.status(502).json({ error: 'Failed to parse AI response as JSON', raw: rawText });
    }

    // Merge AI results with full candidate data
    const candidateMap = {};
    candidates.forEach((c, i) => {
      candidateMap[i + 1] = c;
    });

    const results = aiRankings.map((item) => {
      const candidate = candidateMap[item.candidateIndex];
      return {
        rank: item.rank,
        _id: candidate?._id,
        name: item.name,
        email: candidate?.email,
        skills: candidate?.skills,
        experience: candidate?.experience,
        bio: candidate?.bio,
        matchScore: item.matchScore,
        recommendation: item.recommendation,
        strengths: item.strengths || [],
        gaps: item.gaps || [],
      };
    });

    results.sort((a, b) => a.rank - b.rank);

    res.json({ results, total: results.length, model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { aiShortlist };

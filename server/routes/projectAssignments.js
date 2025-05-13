const express = require('express');
const router = express.Router();
const ProjectAssignment = require('../models/ProjectAssignment');

router.post('/', async (req, res) => {
  try {
    const assignment = new ProjectAssignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find()
      .populate('employee_id', 'full_name employee_id')
      .populate('project_code', 'project_name project_code');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

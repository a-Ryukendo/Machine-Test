const Agent = require('../models/Agent');
const asyncHandler = require('express-async-handler');

const getAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find({}).select('-password');
  res.json(agents);
});

const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id).select('-password');
  
  if (agent) {
    res.json(agent);
  } else {
    res.status(404);
    throw new Error('Agent not found');
  }
});

const registerAgent = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const agentExists = await Agent.findOne({ email });

  if (agentExists) {
    res.status(400);
    throw new Error('Agent already exists');
  }

  const agent = await Agent.create({
    name,
    email,
    phone,
    password,
    createdBy: req.user._id,
  });

  if (agent) {
    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      createdBy: agent.createdBy,
    });
  } else {
    res.status(400);
    throw new Error('Invalid agent data');
  }
});

const updateAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (agent) {
    agent.name = req.body.name || agent.name;
    agent.email = req.body.email || agent.email;
    agent.phone = req.body.phone || agent.phone;
    
    if (req.body.password) {
      agent.password = req.body.password;
    }

    const updatedAgent = await agent.save();

    res.json({
      _id: updatedAgent._id,
      name: updatedAgent.name,
      email: updatedAgent.email,
      phone: updatedAgent.phone,
    });
  } else {
    res.status(404);
    throw new Error('Agent not found');
  }
});

const deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (agent) {
    await agent.deleteOne();
    res.json({ message: 'Agent removed' });
  } else {
    res.status(404);
    throw new Error('Agent not found');
  }
});

module.exports = {
  getAgents,
  getAgentById,
  registerAgent,
  updateAgent,
  deleteAgent,
};
import * as userService from '../services/userService.js';

export async function createUser(req, res) {
  const { agentCode, fullName, role, password } = req.body ?? {};
  if (!agentCode || !fullName) {
    return res.status(400).json({ error: 'agentCode and fullName are required' });
  }
  const validRole = role === 'admin' || role === 'agent';
  if (!validRole) {
    return res.status(400).json({ error: 'role must be admin or agent' });
  }
  try {
    const result = await userService.createUser({ agentCode, fullName, role, password });
    return res.status(201).json(result);
  } catch (err) {
    const status = err.status ?? 500;
    return res.status(status).json({ error: err.message });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await userService.listUsers();
    return res.status(200).json({ users });
  } catch (err) {
    const status = err.status ?? 500;
    return res.status(status).json({ error: err.message });
  }
}

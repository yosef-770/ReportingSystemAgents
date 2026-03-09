import * as authService from '../services/authService.js';

export async function login(req, res) {
  const { agentCode, password } = req.body;
  if (!agentCode || !password) {
    return res.status(400).json({ error: 'agentCode and password are required' });
  }
  try {
    const result = await authService.login(agentCode, password);
    return res.status(200).json(result);
  } catch (err) {
    const status = err.status ?? 500;
    return res.status(status).json({ error: err.message});
  }
}

export function me(req, res) {
  return res.status(200).json({ user: req.user });
}

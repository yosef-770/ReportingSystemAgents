import User from '../models/User.js';
import enAtbash from '../utils/enAtbash.js';

export async function createUser({ agentCode, fullName, role, password }) {
  const existing = await User.findOne({ agentCode });
  if (existing) {
    const err = new Error('agentCode already exists');
    err.status = 409;
    throw err;
  }
  const initialPassword = password ?? enAtbash(fullName);
  const newUser = await User.create({
    agentCode,
    fullName,
    role: role || 'agent',
    passwordHash: initialPassword,
  });
  return {
    user: {
      id: newUser._id,
      agentCode: newUser.agentCode,
      fullName: newUser.fullName,
      role: newUser.role,
      initialPasswordHint: initialPassword,
    },
  };
}

export async function listUsers() {
  const users = await User.find({}).lean();
  return users.map((user) => ({
    id: user._id,
    agentCode: user.agentCode,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt,
  }));
}

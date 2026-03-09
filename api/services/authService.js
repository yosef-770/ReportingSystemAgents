import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(agentId, role) {
    return jwt.sign({ agentId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export async function getUserById(userId) {
  const user = await User.findById(userId).lean();
  if (!user) {
    const err = new Error('User not found');
    err.status = 401;
    throw err;
  }
  return { id: user._id, agentCode: user.agentCode, fullName: user.fullName, role: user.role };
}


export async function login(agentCode, password) {
    const user = await User.findOne({ agentCode }).select('+passwordHash');
    if (!user) {
        const err = new Error('Invalid agentCode or password');
        err.status = 401;
        throw err;
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
        const err = new Error('Invalid agentCode or password');
        err.status = 401;
        throw err;
    }
    return {
        user: { id: user._id, agentCode: user.agentCode, fullName: user.fullName, role: user.role },
        token: signToken(user._id, user.role),
    };
}

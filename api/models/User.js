import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    agentCode: { type: String, required: true, unique: true, trim: true },
    fullName: {type: String, required: true},
    role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
    passwordHash: { type: String, required: true, minLength: 6, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export default mongoose.model('User', userSchema);

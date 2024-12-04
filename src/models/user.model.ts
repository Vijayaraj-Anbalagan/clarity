import mongoose, { Document, Schema, Model } from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Define the IUser interface
export interface IUser extends Document {
  name: string;
  email: string;
  phoneNo: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  verifyToken?: string;
  verifyTokenExpire?: Date;
  isOtpVerified: boolean;
  otpVerifyToken?: string;
  otpVerifyTokenExpire?: Date;
  totalMessages: number;
  totalSessions: number;
  averageResponseTime: number;
  lastActiveAt: Date | null;
  engagementScore: number;
  sentimentStats: {
    positive: number;
    negative: number;
    neutral: number;
  };
  getVerificationToken(): string;
  getOTP(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateEngagementMetrics(
    messageCount: number,
    sentiment: 'positive' | 'negative' | 'neutral',
    responseTime: number
  ): void;
  incrementSessions(): void;
}

// Define the UserSchema
const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpire: { type: Date },
  isOtpVerified: { type: Boolean, default: false },
  otpVerifyToken: { type: String },
  otpVerifyTokenExpire: { type: Date },

  // Metrics for engagement and activity tracking
  totalMessages: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  averageResponseTime: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: null },
  engagementScore: { type: Number, default: 0 },
  sentimentStats: {
    positive: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
  },
});

// Instance methods
UserSchema.methods.getVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  this.verifyToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.verifyTokenExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  return verificationToken;
};

UserSchema.methods.getOTP = function (): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otpVerifyToken = crypto.createHash('sha256').update(otp).digest('hex');
  this.otpVerifyTokenExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  return otp;
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateEngagementMetrics = function (
  messageCount = 1,
  sentiment: 'positive' | 'negative' | 'neutral',
  responseTime = 0
) {
  this.totalMessages += messageCount;
  this.engagementScore +=
    sentiment === 'positive' ? 5 : sentiment === 'neutral' ? 2 : -3;
  if (responseTime > 0) {
    const totalResponses = this.totalMessages || 1;
    this.averageResponseTime =
      (this.averageResponseTime * (totalResponses - 1) + responseTime) /
      totalResponses;
  }
  this.lastActiveAt = new Date();
  this.sentimentStats[sentiment] += 1;
};

UserSchema.methods.incrementSessions = function () {
  this.totalSessions += 1;
};

// Pre-save middleware
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Register the model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

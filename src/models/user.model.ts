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
  getVerificationToken(): string;
  getOTP(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
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

// Pre-save middleware
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Safely register the model
const User: Model<IUser> =
  (mongoose.models && mongoose.models.User) ||
  mongoose.model<IUser>('User', UserSchema);

console.log('User model defined successfully:', !!User);

export default User;

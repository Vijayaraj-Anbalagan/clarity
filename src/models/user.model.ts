import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNo: string;
  password: string;
  role: string;
  isVerified: boolean;
  verifyToken: string;
  verifyTokenExpire: Date;
  isOtpVerified: boolean;
  otpVerifyToken: string;
  otpVerifyTokenExpire: Date;
  getVerificationToken(): string;
  getOTP(): string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpire: {
    type: Date,
  },
  isOtpVerified: { type: Boolean, default: false },
  otpVerifyToken: { type: String },
  otpVerifyTokenExpire: { type: Date },
});

UserSchema.methods.getVerificationToken = function (): string {
  // Generate the token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash the token
  this.verifyToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.verifyTokenExpire = new Date(Date.now() + 5 * 60 * 1000);

  return verificationToken;
};

UserSchema.methods.getOTP = function (): string {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP before storing it
  this.otpVerifyToken = crypto.createHash('sha256').update(otp).digest('hex');

  // Set OTP expiration to 5 minutes
  this.otpVerifyTokenExpire = new Date(Date.now() + 5 * 60 * 1000);

  return otp;
};

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);

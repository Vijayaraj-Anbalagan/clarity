import mongoose, { Schema, Document } from 'mongoose';


interface IToken extends Document {
  refreshToken: string;
  isValid: boolean;
  user: mongoose.Types.ObjectId; // Reference to the User model
}

const TokenSchema = new Schema<IToken>({
  refreshToken: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

const Token =
  (mongoose.models && mongoose.models.Token) ||
  mongoose.model<IToken>('Token', TokenSchema);
export default Token;

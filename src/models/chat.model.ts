import mongoose, { Schema, Document } from 'mongoose';

// Define the schema for a chat message
interface ChatMessage {
  role: 'user' | 'model';
  message: string;
}

// Define the schema for a chat session
interface ChatSessionDocument extends Document {
  userId: string; // This is the user reference
  sessionId: string; // A unique session identifier
  messages: ChatMessage[]; // Messages within this session
  createdAt: Date; // When the session was created
}

const ChatMessageSchema: Schema = new Schema({
  role: { type: String, enum: ['user', 'model'], required: true },
  message: { type: String, required: true },
});

const ChatSessionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    sessionName: { type: String, required: true },
    sessionId: { type: String, required: true },
    messages: { type: [ChatMessageSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create a model based on the schema
const ChatSession =
  mongoose.models.ChatSession ||
  mongoose.model<ChatSessionDocument>('ChatSession', ChatSessionSchema);

export default ChatSession;

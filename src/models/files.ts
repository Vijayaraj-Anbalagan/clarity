import mongoose, { Schema, Document } from 'mongoose';

interface IFileDetails {
    fileName: string;
    url: string;
    details: string;
}

interface IFile extends Document {
    user: mongoose.Schema.Types.ObjectId;
    files: IFileDetails[];
}

const FileDetailsSchema: Schema = new Schema({
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    details: { type: String },
    date : { type: Date, default: Date.now },
    status : { type: String, default: 'pending' }
});

const FileSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    files: { type: [FileDetailsSchema], required: true }
});

const File = mongoose.model<IFile>('File', FileSchema);

export default File;
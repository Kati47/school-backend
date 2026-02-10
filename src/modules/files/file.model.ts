import mongoose, { Schema, Document } from "mongoose";

export interface FileDocument extends Document {
  uploaderId: mongoose.Types.ObjectId;
  gridFsId: mongoose.Types.ObjectId;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url: string;
}

const fileSchema = new Schema<FileDocument>(
  {
    uploaderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gridFsId: { type: Schema.Types.ObjectId, required: true },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }
  },
  { timestamps: true }
);

export const FileModel = mongoose.model<FileDocument>("File", fileSchema);

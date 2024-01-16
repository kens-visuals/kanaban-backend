import mongoose, { Types } from 'mongoose';

type BoardSchemaType = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const BoardSchema = new mongoose.Schema<BoardSchemaType>(
  { name: String },
  { timestamps: true }
);

export const Board = mongoose.model('Board', BoardSchema);

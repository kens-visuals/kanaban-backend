import mongoose from 'mongoose';

type BoardSchemaType = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const BoardSchema = new mongoose.Schema<BoardSchemaType>(
  { name: { type: String, required: true } },
  { timestamps: true }
);

export const Board = mongoose.model('Board', BoardSchema);

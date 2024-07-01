import mongoose from 'mongoose';

type BoardSchemaType = {
  name: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
};

const BoardSchema = new mongoose.Schema<BoardSchemaType>(
  {
    name: { type: String, required: true },
    user_id: { type: String, required: true },
  },
  { timestamps: true }
);

BoardSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

BoardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Board = mongoose.model('Board', BoardSchema);

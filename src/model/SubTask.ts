import { Schema, model } from 'mongoose';

export type SubtaskSchemaType = {
  title: string;
  completed: boolean;
  parent_task_id: Schema.Types.ObjectId;
  updatedAt?: Date;
};

const SubtaskSchema = new Schema<SubtaskSchemaType>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    parent_task_id: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

SubtaskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

SubtaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Subtask = model('Subtask', SubtaskSchema);

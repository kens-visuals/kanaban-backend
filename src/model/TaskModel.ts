import mongoose, { Schema, Types } from 'mongoose';

export type TaskSchemaType = {
  title: string;
  user_id: string;
  description?: string;
  current_status: string;
  subtasks?: Types.ObjectId[];
  parent_board_id: Types.ObjectId;
};

const TaskSchema = new mongoose.Schema<TaskSchemaType>(
  {
    description: String,
    title: { type: String, required: true },
    user_id: { type: String, required: true },
    current_status: { type: String, required: true },
    subtasks: [{ ref: 'Subtask', type: Types.ObjectId }],
    parent_board_id: {
      ref: 'Board',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

TaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Task = mongoose.model('Task', TaskSchema);

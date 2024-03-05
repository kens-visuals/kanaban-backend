import { Schema, model } from 'mongoose';

type SubtaskSchemaType = {
  title: string;
  completed: boolean;
  parent_task_id: Schema.Types.ObjectId;
};

const SubtaskSchema = new Schema<SubtaskSchemaType>(
  {
    completed: Boolean,
    title: { type: String, required: true },
    parent_task_id: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export const Subtask = model('Subtask', SubtaskSchema);

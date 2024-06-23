import { Types } from 'mongoose';
import { Request, Response } from 'express';

import { Task } from '../model/TaskModel';
import { Subtask } from '../model/SubTask';

export const markSubtask = async (req: Request, res: Response) => {
  try {
    const { subtask_id } = req.body as { subtask_id: Types.ObjectId };

    const subtask = await Subtask.findById(subtask_id);

    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    const updatedCompletedState = !subtask.completed;

    const updatedSubtask = await Subtask.findByIdAndUpdate(
      subtask_id,
      { completed: updatedCompletedState },
      { new: true }
    );

    if (updatedSubtask) {
      const parentTask = await Task.findById(subtask.parent_task_id).populate(
        'subtasks'
      );

      if (parentTask) {
        parentTask.completed_subtasks = parentTask.subtasks.filter(
          (subtask: any) => subtask.completed === true
        ).length;

        await parentTask.save();
      }
    }

    res.status(200).json(updatedSubtask);
  } catch (error) {
    console.error('Error marking subtask as completed:', error);
    res.status(500).json({ message: error.message });
  }
};

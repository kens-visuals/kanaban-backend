import { Types } from 'mongoose';
import { Request, Response } from 'express';

import { Task } from '../model/TaskModel';
import { Subtask } from '../model/SubTask';

export const getSubtasks = async (req: Request, res: Response) => {
  try {
    const subtasks = await Subtask.find();

    res.status(200).json(subtasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSubtasksByParentTaskId = async (
  req: Request,
  res: Response
) => {
  try {
    const { parent_task_id } = req.params as {
      parent_task_id: string;
    };

    console.log('Received parent_task_id:', parent_task_id);

    const subtasks = await Subtask.find({ parent_task_id });

    console.log('Found subtasks:', subtasks);

    res.status(200).json(subtasks);
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    res.status(500).json({ message: error.message });
  }
};

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

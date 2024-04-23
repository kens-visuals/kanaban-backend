import { Types } from 'mongoose';
import { Request, Response } from 'express';

import { Subtask } from '../model/SubTask';

export const markSubtask = async (req: Request, res: Response) => {
  try {
    const { subtaskId } = req.body as { subtaskId: Types.ObjectId };

    const subtask = await Subtask.findById(subtaskId);

    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    const updatedCompletedState = !subtask.completed;

    const updatedSubtask = await Subtask.findByIdAndUpdate(
      subtaskId,
      { completed: updatedCompletedState },
      { new: true }
    );

    res.status(200).json(updatedSubtask);
  } catch (error) {
    console.error('Error marking subtask as completed:', error);
    res.status(500).json({ message: error.message });
  }
};

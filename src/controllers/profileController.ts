import { Request, Response } from "express";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
};

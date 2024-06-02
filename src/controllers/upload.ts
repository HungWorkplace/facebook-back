import { Request, Response } from "express";

export const uploadAvatar = async (req: Request, res: Response) => {
  console.log(req.file);
  res.send("It worked");
};

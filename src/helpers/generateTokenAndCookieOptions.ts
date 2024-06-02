import { IUserDocument } from "../models/user";

export const generateTokenAndCookieOptions = (user: IUserDocument) => {
  const token = user.generateToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    Object.assign(cookieOptions, { secure: true });
  }

  return { token, cookieOptions };
};

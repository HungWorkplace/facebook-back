class AppError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

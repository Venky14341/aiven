export class AppError extends Error {
  constructor(message: string, public statusCode = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

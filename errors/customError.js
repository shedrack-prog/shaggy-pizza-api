export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}
export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}
export class UnAuthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnAuthenticatedError';
    this.statusCode = 401;
  }
}
export class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnAuthorizedError';
    this.statusCode = 403;
  }
}

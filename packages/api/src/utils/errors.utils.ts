class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
class ExternalServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExternalServiceError';
  }
}
class DatabaseTimeoutError extends Error {
  constructor(message: string = 'Database request timed out') {
    super(message);
    this.name = 'DatabaseTimeoutError';
  }
}

export {
  NotFoundError,
  ConflictError,
  ValidationError,
  UnauthorizedError,
  ExternalServiceError,
  DatabaseTimeoutError,
};

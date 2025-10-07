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

export {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ExternalServiceError,
};

export const CODETASK_VALIDATION = {
  CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
    MESSAGE: 'Content must be between 1-500 characters',
  },
  FILE_PATH: {
    MAX_LENGTH: 260,
    // NOTE: This is a "safe" pattern but disallows spaces. Re-evaluate if paths with spaces need to be supported.
    PATTERN: /^[a-zA-Z0-9\-_./\\:@]+$/,
    MESSAGE: 'Invalid file path format',
  },
  LINE_NUMBER: {
    MIN: 1,
    MAX: 100000,
    MESSAGE: 'Line number must be between 1-100000',
  },
  CUSTOM_TAG: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z][A-Z0-9_]*$/,
    MESSAGE:
      'Custom tag must start with a letter and contain only uppercase letters, numbers, and underscores',
  },
  META: {
    MIN_COUNT: 0,
    MAX_COUNT: 10000,
    MESSAGE: 'Count must be between 0-10000',
  },
};

export const USER_VALIDATION = {
  PASSWORD_HASH: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
    MESSAGE: 'Password hash must be between 1-255 characters',
  },
  FIRST_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    MESSAGE: 'First name must be between 1-50 characters',
  },
  LAST_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    MESSAGE: 'Last name must be between 1-50 characters',
  },
};

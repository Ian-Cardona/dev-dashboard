export const CODETASK_VALIDATION = {
  CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
    MESSAGE: 'Content must be between 1-500 characters',
  },
  FILE_PATH: {
    MAX_LENGTH: 260,
    PATTERN: /^[a-zA-Z0-9\-_./\\:@]+$/,
    MESSAGE: 'Invalid file path format',
  },
  LINE_NUMBER: {
    MIN: 1,
    MAX: 100000,
    MESSAGE: 'Line number must be between 1-100000',
  },
  SYNCED_AT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9\-_./\\:@]+$/,
    MESSAGE: 'Invalid synced at format',
  },
  CUSTOM_TAG: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z][A-Z0-9_]*$/,
    MESSAGE: 'Custom tag must be UPPERCASE with underscores only',
  },
  ID: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    MESSAGE: 'ID must be between 1-50 characters',
  },
  USER_ID: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    MESSAGE: 'User ID must be between 1-50 characters',
  },
  META: {
    MIN_COUNT: 0,
    MAX_COUNT: 10000,
    MESSAGE: 'Count must be between 0-10000',
  },
};

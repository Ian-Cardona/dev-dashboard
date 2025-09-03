export const VALIDATION_CONSTANTS = {
  USER: {
    FIRST_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s'-]+$/,
      MESSAGE:
        'First name must be 1-50 characters and contain only letters, spaces, hyphens, apostrophes, and periods',
    },
    LAST_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s'-]+$/,
      MESSAGE:
        'Last name must be 1-50 characters and contain only letters, spaces, hyphens, apostrophes, and periods',
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 128,
      PATTERN:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      MESSAGE:
        'Password must be 8-128 characters, include upper and lower case letters, numbers, and special characters',
    },
    EMAIL: {
      MAX_LENGTH: 254,
      MESSAGE: 'Invalid email address format',
    },
    REFRESH_TOKEN: {
      MIN_LENGTH: 32,
      MAX_LENGTH: 512,
      MESSAGE: 'Invalid refresh token format',
    },
  },
  TODO: {
    CONTENT: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 500,
      MESSAGE: 'Content must be between 1-255 characters',
    },
    FILE_PATH: {
      MAX_LENGTH: 260,
      PATTERN:
        /^(?!.*\.\.)(?!.*\/\/)(?!.*\\\\)[a-zA-Z0-9\s\-_./\\:@()[\]{}~`!#$%^&+=,;]+$/,
      MESSAGE:
        'Invalid file path format - no directory traversal or double separators allowed',
    },
    LINE_NUMBER: {
      MIN: 1,
      MAX: 100000,
      MESSAGE: 'Line number must be between 1-100000',
    },
    PROJECT_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 255,
      MESSAGE: 'Project name must be between 1-255 characters',
    },
    CUSTOM_TAG: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 20,
      PATTERN: /^[A-Z][A-Z0-9_]*$/,
      MESSAGE:
        'Custom tag must start with uppercase letter and contain only uppercase letters, numbers, and underscores',
    },
    META: {
      MIN_COUNT: 0,
      MAX_COUNT: 10000,
      MESSAGE: 'Count must be between 0-10000',
    },
  },
} as const;

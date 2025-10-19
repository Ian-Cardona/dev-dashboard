/* eslint-disable no-control-regex */
export const PASSWORD_COMMON_PATTERNS = [
  /0123|1234|2345|3456|4567|5678|6789|7890/,
  /abcd|bcde|cdef|defg|efgh|fghi|ghij|hijj|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz/i,
  /qwerty|asdfgh|zxcvbn|qazwsx|qweasd/i,
] as const;

export const PASSWORD_COMMON_WORDS = [
  'password',
  'password123',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  'dragon',
  'master',
  'sunshine',
  'princess',
];

export const VALIDATION_CONSTANTS = {
  USER: {
    FIRST_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s'-]+$/,
      MESSAGE:
        'First name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes',
    },
    LAST_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s'-]+$/,
      MESSAGE:
        'Last name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes',
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 128,
      BASE_PATTERN:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      ALLOWED_PATTERN: /^[\x20-\x7E\u00A0-\uFFFF]*$/,
      FORBIDDEN_CONTROL_CHARS: /[\x00-\x1F\x7F]/,
      MESSAGE: {
        BASE: 'Password must be 8-128 characters with uppercase, lowercase, numbers, and special characters',
        REPEATING: 'Password cannot contain 4 or more repeating characters',
        PATTERN: 'Password contains common sequential patterns',
        COMMON: 'Password is too common',
        EMAIL: 'Password cannot contain your email or username',
        WHITESPACE: 'Password cannot have leading or trailing spaces',
        CONTROL_CHARS: 'Password contains invalid control characters',
        INVALID_CHARS: 'Password contains invalid characters',
      },
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
      MESSAGE: 'Content must be between 1-500 characters',
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

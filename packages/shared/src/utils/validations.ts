import {
  PASSWORD_COMMON_PATTERNS,
  PASSWORD_COMMON_WORDS,
  VALIDATION_CONSTANTS,
} from './constants';
import z from 'zod';

export const strongPasswordSchema = z
  .string()
  .trim()
  .refine(
    pwd => pwd.length >= VALIDATION_CONSTANTS.USER.PASSWORD.MIN_LENGTH,
    `Password must be at least ${VALIDATION_CONSTANTS.USER.PASSWORD.MIN_LENGTH} characters`
  )
  .refine(
    pwd => pwd.length <= VALIDATION_CONSTANTS.USER.PASSWORD.MAX_LENGTH,
    `Password must not exceed ${VALIDATION_CONSTANTS.USER.PASSWORD.MAX_LENGTH} characters`
  )
  .refine(
    pwd => VALIDATION_CONSTANTS.USER.PASSWORD.BASE_PATTERN.test(pwd),
    VALIDATION_CONSTANTS.USER.PASSWORD.MESSAGE.BASE
  )
  .refine(
    pwd => !/(.)\1{3,}/.test(pwd),
    VALIDATION_CONSTANTS.USER.PASSWORD.MESSAGE.REPEATING
  )
  .refine(
    pwd => !PASSWORD_COMMON_PATTERNS.some(pattern => pattern.test(pwd)),
    VALIDATION_CONSTANTS.USER.PASSWORD.MESSAGE.PATTERN
  )
  .refine(
    pwd => !PASSWORD_COMMON_WORDS.includes(pwd.toLowerCase()),
    VALIDATION_CONSTANTS.USER.PASSWORD.MESSAGE.COMMON
  )
  .refine(
    pwd =>
      !VALIDATION_CONSTANTS.USER.PASSWORD.FORBIDDEN_CONTROL_CHARS.test(pwd),
    VALIDATION_CONSTANTS.USER.PASSWORD.MESSAGE.CONTROL_CHARS
  );

export const passwordLoginSchema = z
  .string()
  .trim()
  .min(1, 'Invalid password')
  .max(VALIDATION_CONSTANTS.USER.PASSWORD.MAX_LENGTH, 'Invalid password')
  .refine(
    pwd => VALIDATION_CONSTANTS.USER.PASSWORD.ALLOWED_PATTERN.test(pwd),
    'Invalid password'
  )
  .refine(
    pwd =>
      !VALIDATION_CONSTANTS.USER.PASSWORD.FORBIDDEN_CONTROL_CHARS.test(pwd),
    'Invalid password'
  );

export const firstNameSchema = z
  .string()
  .trim()
  .min(
    VALIDATION_CONSTANTS.USER.FIRST_NAME.MIN_LENGTH,
    VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
  )
  .max(
    VALIDATION_CONSTANTS.USER.FIRST_NAME.MAX_LENGTH,
    VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
  )
  .regex(
    VALIDATION_CONSTANTS.USER.FIRST_NAME.PATTERN,
    VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
  );

export const lastNameSchema = z
  .string()
  .trim()
  .min(
    VALIDATION_CONSTANTS.USER.LAST_NAME.MIN_LENGTH,
    VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
  )
  .max(
    VALIDATION_CONSTANTS.USER.LAST_NAME.MAX_LENGTH,
    VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
  )
  .regex(
    VALIDATION_CONSTANTS.USER.LAST_NAME.PATTERN,
    VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
  );

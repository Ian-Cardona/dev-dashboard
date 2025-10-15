import { VALIDATION_CONSTANTS } from '../constants/validations';
import {
  linkedProviderSchema,
  oAuthProviderEnum,
} from './common/common.schema';
import { userResponsePublicSchema } from './user.schema';
import z from 'zod';

// Helper Validation
export const passwordStrengthValidation = (email?: string, username?: string) =>
  z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    )
    .refine(
      pwd =>
        !(
          email && pwd.toLowerCase().includes(email.split('@')[0].toLowerCase())
        ),
      {
        message: 'Password cannot contain your email',
      }
    )
    .refine(
      pwd => !(username && pwd.toLowerCase().includes(username.toLowerCase())),
      {
        message: 'Password cannot contain your username',
      }
    )
    .refine(pwd => !/(.)\1{3,}/.test(pwd), {
      message: 'Password cannot contain 4 or more repeating characters',
    })
    .refine(
      pwd =>
        !/(0123|1234|2345|3456|4567|5678|6789|7890|abcd|bcde|cdef|qwerty)/i.test(
          pwd
        ),
      {
        message: 'Password is too simple',
      }
    );

export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(128, 'Password must not exceed 128 characters')
  .refine(pwd => /^[\x20-\x7E]+$/.test(pwd), {
    message: 'Password contains invalid characters',
  });

export const registerInitEmailRegisterRequestSchema = z.object({
  email: z.email(),
  password: passwordStrengthValidation(),
});

export const registerInitOAuthRegisterRequestSchema = z.object({
  provider: oAuthProviderEnum,
  id: z.string(),
  login: z.string(),
});

export const registerGithubAuthLinkResponseSchema = z.object({
  provider: z.literal('github'),
  authorize_uri: z.url(),
});

// Register Validation
export const onboardingInfoRequestSchema = z.object({
  email: z.email(),
  firstName: z
    .string({ message: 'Invalid first name' })
    .trim()
    .min(
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MIN_LENGTH,
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
    )
    .max(
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MAX_LENGTH,
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
    ),
  lastName: z
    .string({ message: 'Invalid last name' })
    .trim()
    .min(
      VALIDATION_CONSTANTS.USER.LAST_NAME.MIN_LENGTH,
      VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
    )
    .max(
      VALIDATION_CONSTANTS.USER.LAST_NAME.MAX_LENGTH,
      VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
    ),
});

// export const authenticationEmailRegisterRequestSchema =
//   onboardingInfoRequestSchema.extend({
//     password: passwordStrengthValidation(),
//   });

export const authenticationEmailRegisterRequestSchema =
  onboardingInfoRequestSchema.extend({
    passwordHash: z
      .string({ message: 'Invalid password hash' })
      .min(10, 'Invalid hash length'),
  });

export const authenticationOAuthRegisterRequestSchema =
  onboardingInfoRequestSchema.extend({
    providers: z
      .array(linkedProviderSchema)
      .min(1, 'At least one provider is required'),
  });

export const registerInitSessionDataSchema = z.discriminatedUnion(
  'registrationType',
  [
    z.object({
      registrationType: z.literal('email'),
      email: z.email(),
      passwordHash: z.string(),
      createdAt: z.string(),
    }),
    z.object({
      registrationType: z.literal('oauth'),
      provider: oAuthProviderEnum,
      providerUserId: z.string(),
      providerUserLogin: z.string(),
      createdAt: z.string(),
    }),
  ]
);

// Login Validation
export const authenticationLoginRequestPublicSchema = z.object({
  email: z.email(),
  password: loginPasswordSchema,
});

// Success Response Validation
export const authenticationSuccessResponsePrivateSchema = z.object({
  accessToken: z.jwt(),
  refreshTokenPlain: z.string(),
  refreshTokenId: z.uuidv4(),
  user: userResponsePublicSchema,
});

// Refresh Validation
export const authenticationRefreshRequestPrivateSchema = z.object({
  refreshTokenId: z.uuidv4(),
  refreshTokenPlain: z.string(),
});

// Refresh Response Validation
export const authenticationRefreshResponsePrivateSchema = z.object({
  accessToken: z.jwt(),
  refreshTokenPlain: z.string(),
  refreshTokenId: z.uuidv4(),
});

// Public Response Validation
export const authenticationResponsePublicSchema = z.object({
  accessToken: z.jwt(),
  user: userResponsePublicSchema,
});

export const authorizationJwtSchema = z.object({
  accessToken: z.jwt(),
});

import {
  emailSchema,
  jwtSchema,
  linkedProviderSchema,
  oauthProviderEnum,
  passwordHashSchema,
  uuidSchema,
} from '../utils/common';
import {
  firstNameSchema,
  lastNameSchema,
  passwordLoginSchema,
  strongPasswordSchema,
} from '../utils/validations';
import { userPublicSchema } from './user.schema';
import z from 'zod';

export const registerInitEmailRequestSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
});

export const oauthRequestSchema = z.object({
  provider: oauthProviderEnum,
  id: z.string().min(1).max(100),
  login: z.string().min(1).max(100),
  access_token: z.string().min(1).max(512),
});

export const registrationInfoRequestSchema = z.object({
  email: emailSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

export const registrationJtiSchema = z.discriminatedUnion('registrationType', [
  z.object({
    registrationType: z.literal('email'),
    email: emailSchema,
    passwordHash: passwordHashSchema,
    createdAt: z.string().min(1).max(100),
  }),
  z.object({
    registrationType: z.literal('oauth'),
    provider: oauthProviderEnum,
    providerUserId: z.string().min(1).max(100),
    providerUserLogin: z.string().min(1).max(100),
    providerAccessTokenEncrypted: z.string().min(1).max(512),
    createdAt: z.string().min(1).max(100),
  }),
]);

export const registerInitTokenSchema = z.object({
  registrationToken: z.string().min(1).max(255).trim(),
});

export const registrationSessionSchema = z.object({
  registrationToken: z.string().min(1).max(255).trim(),
  registrationId: z.string().min(1).max(255).trim(),
});

export const completeRegisterByEmailRequestSchema =
  registrationInfoRequestSchema.extend({
    passwordHash: passwordHashSchema,
  });

export const completeRegisterByOAuthRequestSchema =
  registrationInfoRequestSchema.extend({
    providers: z
      .array(linkedProviderSchema)
      .min(1, 'At least one provider is required'),
    accessTokenEncrypted: z.string().min(1).max(522),
  });

export const loginRequestPublicSchema = z.object({
  email: emailSchema,
  password: passwordLoginSchema,
});

export const loginPrivateSchema = z.object({
  accessToken: jwtSchema,
  refreshTokenPlain: z.string(),
  refreshTokenId: uuidSchema,
  user: userPublicSchema,
});

export const loginPublicSchema = z.object({
  accessToken: jwtSchema,
  user: userPublicSchema,
});

export const refreshRequestPrivateSchema = z.object({
  refreshTokenId: uuidSchema,
  refreshTokenPlain: z.string(),
});

export const refreshPrivateSchema = z.object({
  accessToken: jwtSchema,
  refreshTokenPlain: z.string(),
  refreshTokenId: uuidSchema,
});

export const authorizationJwtSchema = z.object({
  accessToken: jwtSchema,
});

export const cookieUserSchema = z.object({
  userId: uuidSchema,
  email: emailSchema.optional(),
});

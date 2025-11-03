import { Request, Response, NextFunction } from 'express';
import { docClient } from 'src/config/dynamodb';
import { ENV } from 'src/config/env';
import { UserRepository } from 'src/user/user.repository';
// import { UserService } from 'src/user/user.service';
import { decrypt } from 'src/utils/crypto.utils';
import { UnauthorizedError } from 'src/utils/errors.utils';

const userRepository = UserRepository(docClient);
// const userService = UserService(userRepository);

export const githubSessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) {
      throw new UnauthorizedError('User session invalid');
    }

    const user = await userRepository.findById(req.user.userId);

    if (!user || !user) {
      throw new UnauthorizedError('User not found');
    }

    const githubProvider = user.providers.find(p => p.provider === 'github');

    if (!githubProvider) {
      throw new UnauthorizedError('GitHub integration not found');
    }

    const userProvider = await userRepository.findProviderByUserId(
      user.id,
      githubProvider.provider
    );
    console.table(userProvider);

    if (!userProvider || !userProvider.providerAccessTokenEncrypted) {
      throw new UnauthorizedError('GitHub integration not found');
    }

    const decryptedToken = decrypt(userProvider?.providerAccessTokenEncrypted);

    req.githubUser = {
      access_token: decryptedToken,
      token_type: 'bearer',
      scope: ENV.GITHUB_SCOPE,
    };

    next();
  } catch (error) {
    next(error);
  }
};

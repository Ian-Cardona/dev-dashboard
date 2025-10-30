import { Request, Response, NextFunction } from 'express';
import { docClient } from 'src/config/dynamodb';
import { UserRepository } from 'src/user/user.repository';
import { UnauthorizedError } from 'src/utils/errors.utils';

const userRepository = UserRepository(docClient);

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

    if (!user || !user.providers) {
      throw new UnauthorizedError('GitHub integration not found');
    }

    const githubProvider = user.providers.find(p => p.provider === 'github');

    if (!githubProvider) {
      throw new UnauthorizedError('GitHub integration not found');
    }

    const provider = await userRepository.findByProvider(
      githubProvider.provider,
      githubProvider.providerUserId
    );

    if (!provider || !provider.isActive) {
      throw new UnauthorizedError('GitHub integration not found');
    }

    // const decryptedToken = decryptValue(provider.accessTokenEncrypted);

    // req.githubUser = {
    //   accessToken: decryptedToken,
    // };

    next();
  } catch (error) {
    next(error);
  }
};

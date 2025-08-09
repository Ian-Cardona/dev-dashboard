import { Router } from 'express';

import { docClient } from '../config/dynamodb';
import { RefreshTokenModel } from '../models/refreshToken.model';
import { RefreshTokenService } from '../services/refreshToken.service';
import { RefreshTokenController } from '../controllers/refreshToken.controller';

const router = Router();

const refreshTokenRepositoryInstance = RefreshTokenModel(docClient);
const refreshTokenServiceInstance = RefreshTokenService(
  refreshTokenRepositoryInstance
);
const refreshTokenControllerInstance = RefreshTokenController(
  refreshTokenServiceInstance
);

router.post('/', refreshTokenControllerInstance.createRefreshToken);
router.get(
  '/:userId/:tokenId',
  refreshTokenControllerInstance.findRefreshTokenByUserAndToken
);
router.delete(
  '/:userId/:tokenId',
  refreshTokenControllerInstance.deleteRefreshTokenByUserAndToken
);
router.delete(
  '/:userId',
  refreshTokenControllerInstance.deleteAllUserTokensByUserId
);
router.delete('/', refreshTokenControllerInstance.deleteExpiredTokens);

export default router;

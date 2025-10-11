import { RegisterInitEmailRegisterRequest } from '@dev-dashboard/shared';

export interface IRegisterInitService {
  email(
    data: RegisterInitEmailRegisterRequest
  ): Promise<{ registerInitToken: string }>;
}

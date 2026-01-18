import { Request } from 'express';

export type UserToken = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
};

export interface ModifiedRequest extends Request {
  user: UserToken;
}

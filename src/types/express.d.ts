import { ICurrentUser } from '../interfaces/current-user.interface';

declare global {
  namespace Express {
    interface Request {
      currentUser?: ICurrentUser;
      user?: ICurrentUser;
    }
  }
}

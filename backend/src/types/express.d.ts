import { User } from '../models/user.model';
import { SortParameters } from '../types/product.types';

declare global {
  namespace Express {
    interface User extends User {}
    interface Request {
        sortParams: SortParameters;
    }
  }
}
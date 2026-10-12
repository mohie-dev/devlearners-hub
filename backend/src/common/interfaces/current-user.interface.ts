import { UserRole } from '../enums.js';

export interface CurrentUserData {
    id: string;
    email: string;
    role: UserRole;
}

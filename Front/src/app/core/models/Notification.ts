import { User } from './User';

export class Notification {
    id?: number;
    message?: string;
    date?: Date;
    read?: boolean;
    users?: User[];
    link?: string;
}
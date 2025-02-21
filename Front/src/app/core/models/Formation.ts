import { User } from './User';

export class Formation {
    id?: number;
    nom?: string;
    dateDebut?:Date;
    dateFin?:Date;
    users?: User[];

    
}
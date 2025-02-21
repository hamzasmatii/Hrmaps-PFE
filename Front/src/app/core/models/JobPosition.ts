import { User } from './User';
import { Competence } from './Competence';

export class JobPosition {
    id?: number;
    nom?: string;
    description?: string;
    competencesRequises?: Competence[];

   
}
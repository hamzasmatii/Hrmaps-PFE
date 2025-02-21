import { Competence } from './Competence';
import { EvaluationType } from './EvaluationType';
import { User } from './User';

export class Evaluation {
    id?: number;
    eval?: EvaluationType;
    competence?:Competence;
    note?:number;
    user? : User;
    dateEvalu?:Date;

    
}
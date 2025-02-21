import { JobPosition } from './JobPosition';
import { EvaluationType } from './EvaluationType';
import { Evaluation } from './Evaluation';

export class Competence {
    id?: number;
    nom?: string;
    description?: string;
    jobPosition?: JobPosition;
    evaluation?:Evaluation[];


    
}
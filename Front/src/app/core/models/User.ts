import { Evaluation } from './Evaluation';
import { Formation } from './Formation';
import { JobPosition } from './JobPosition';
import { ServiceEq } from './ServiceEq';
import { UserType } from './UserType';

export class User {
    id?: number;
    identifiantUser?: string;
    email?:string;
    number?:number;
    nom?: string;
    prenom?: string;
    mdp?: string;
    type?: UserType;
    serviceEq?: ServiceEq;
    chefEquipeService?:ServiceEq;
    evaluations?:Evaluation;
    notePoste?:number;
    formation?:Formation[];



   
}
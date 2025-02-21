import { ServiceEq } from "src/app/core/models/ServiceEq";
import { User } from "src/app/core/models/User";

// Table data
export interface Table {
    id?: number;
    nom?: string;
    chefEquipe?: User;
    employes?: User[];
}

// Search Data
export interface SearchResult {
    tables: ServiceEq[];
    total: number;
}

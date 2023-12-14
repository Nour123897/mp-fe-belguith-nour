import { Categorie } from "./categorie";

    export class Produit {
        id!:number ;
        code!:string;
        designation!: string;
        prix!:number; 
        categorie_id!: number ;
        categorie!: Categorie;
    }
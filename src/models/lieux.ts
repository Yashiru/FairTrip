import { Info } from "./info";
import { Location } from "./location";

export class Lieux {
    public categorie: string;
    public isValid: Boolean;
    public infos: Info = new Info();
    public location: Location = new Location();
    public nom: string;
    public type: string;

    constructor(){
    }

    public factorise(json: any) {
        this.categorie = json.categorie;
        this.infos.factorise(json.infos);
        this.isValid = json.isValid;
        this.location.factorise(json.location);
    }
}

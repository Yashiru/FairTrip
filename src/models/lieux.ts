import { Info } from "./info";
import { Location } from "./location";
import { Avis } from './avis';

export class Lieux {
    public categorie: string;
    public isValid: Boolean;
    public infos: Info = new Info();
    public location: Location = new Location();
    public nom: string;
    public type: string;
    public avis: Avis[];

    constructor(){
    }

    public factorise(json: any) {
        var avi: Avis = new Avis();
        this.categorie = json.categorie;
        this.infos.factorise(json.infos);
        this.isValid = json.isValid;
        this.location.factorise(json.location);
        this.type = json.type;
        this.nom = json.nom;
        if(json.avis != null){
            for(let avis of json.avis){
                this.avis.push(avi.factorise(avis));
            }
        }
    }
}

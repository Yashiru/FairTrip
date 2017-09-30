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
    public isSended: Boolean;   
    public avis: Avis[] = [];

    constructor(nom?){
        this.categorie = "";
        this.isValid = false;
        this.type = "";
        if(nom)
            this.nom = nom;
    }

    public getAverageNote(): number{
        var sum: number = 0;
        var numberOfNote: number = 0;
        for(let avis of this.avis){
            console.log(avis.note);
            sum += avis.note;
            numberOfNote++;
        }
        return sum/numberOfNote;
    }

    public factorise(json: any) {
        this.categorie = json.categorie;
        this.infos.factorise(json.infos);
        this.isValid = json.isValid;
        this.location.factorise(json.location);
        this.type = json.type;
        this.nom = json.nom;
        if(json.avis != null){
            for(let avis of json.avis){
                var avi: Avis = new Avis();
                avi.factorise(avis)
                this.avis.push(avi);
            }
        }
    }
}

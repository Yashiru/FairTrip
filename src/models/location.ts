import { Adresse } from "./adresse";

export class Location {
  public adresse: Adresse = new Adresse();
  public latitude: number;
  public longitude: number;

  public factorise(json: any){
      this.adresse.factorise(json.adresse);
      this.latitude = json.latitude;
      this.longitude = json.longitude;
  }
}

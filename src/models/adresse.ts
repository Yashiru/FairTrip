export class Adresse {
  public details: string;
  public pays: string;

  constructor(){
    this.details = "";
    this.pays = "";
  }

  public factorise(json: any){
    this.details = json.details;
    this.pays = json.pays
  }
}

export class Adresse {
  public details: string;
  public pays: string;

  public factorise(json: any){
    this.details = json.details;
    this.pays = json.pays
  }
}

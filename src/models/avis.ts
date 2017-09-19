export class Avis {
    public note: number;
    public posterName: string;
    public content: string;
    public date: string;
  
    public factorise(json: any): void{
        this.note = json.note;
        this.date = json.date;
        this.posterName = json.posterName;
        this.content = json.content;
    }
  }
  
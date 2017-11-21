export class Avis {
    public note: number;
    public posterName: string;
    public content: string;
    public date: string;
    public stars: string[] = [];

    constructor(){
        
    }

    public factorise(json: any): void{
        this.note = json.note;
        this.date = json.date;
        this.posterName = json.posterName;
        this.content = json.content;
    }

    public setStarsString(note){
        this.stars.splice(0, this.stars.length);
        for(let i = 1; i <= 5; i++){
            if(i <= note)
            {
                this.stars.push('star');
            }
            else
            {
                this.stars.push('star-outline');
            }
        }
        return this.stars;
    }
  }
  
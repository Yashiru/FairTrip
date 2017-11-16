export class Info {
    public description: String;
    public mail: string;
    public tel: string;
    public website: string;

    public factorise(json){
        this.description = json.description;
        this.mail = json.mail;
        this.tel = json.tel;
        this.website = json.website;
    }
}

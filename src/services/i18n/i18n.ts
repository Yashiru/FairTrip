import { Injectable } from '@angular/core';
import { Globalization } from '@ionic-native/globalization';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class I18n {
    public terms: any;
    public fireBaseTable: string = "";

    constructor(private globalization: Globalization, private http: Http){ 
    
    }

    public setLanguage(callback: (table: string) => void) {
        this.globalization.getPreferredLanguage()
        .then(res => {
            var fileName;
            var tableName: string;
            if(res.value.indexOf("fr-") != -1){
                fileName = "fr";
                tableName = "/Lieux"
            }
            else{
                fileName = "en";
                tableName = "/Places"
            }
            callback(tableName);
            this.getJSON(fileName).subscribe(data => {
                this.terms=data;
                this.fireBaseTable = tableName;
            }, error => console.log(error));
        })
        .catch(e => {
            var tableName: string;
            callback("/Places");
            this.getJSON("en").subscribe(data => {
                this.terms=data;
                tableName = "/Places"
                this.fireBaseTable = tableName;
            }, error => console.log(error));
        });
    }

    public getJSON(fileName): Observable<any> {
        return this.http.get("./assets/i18n/"+fileName+".json")
                        .map((res:any) => res.json())
                        .catch((error:any) => null);                        
    }
}
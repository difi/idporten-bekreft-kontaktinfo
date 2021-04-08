import {observable} from "mobx";

export class Kontaktinfo {

    @observable email = "";
    @observable mobile = "";

    @observable emailConfirmed = "";
    @observable mobileConfirmed = "";

    @observable history = {
        "email":"",
        "mobile":""
    };

    constructor(data) {
        if(typeof data === "undefined") {
            return;
        }

        this.code = data.code || "";
        this.email = data.email || "";
        this.mobile = data.mobile || "";

        this.emailConfirmed = this.email;
        this.mobileConfirmed = this.mobile;

        this.history = {
            "email" : this.email,
            "mobile" : this.mobile
        };
    }

    get isKontaktinfoUpdated(){
        return (this.email !== this.history.email || this.mobile !== this.history.mobile);
    }
}
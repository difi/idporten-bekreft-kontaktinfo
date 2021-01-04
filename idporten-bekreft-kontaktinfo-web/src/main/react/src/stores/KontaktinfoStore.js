import {action, observable} from 'mobx';
import axios from "axios";
import {API_BASE_URL} from "../index";

export default class KontaktinfoStore {
    @observable kontaktinfo = {};
    @observable error = {};
    @observable gotoUrl = "";
    @observable code = "";
    @observable language = "";
    @observable current = new Kontaktinfo();

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @action.bound
    setGotoUrl(gotoUrlParam) {
        this.gotoUrl = gotoUrlParam;
    }

    @action.bound
    async setLanguage(lng) {
        this.language = lng;
        return this.language
    }

    @action.bound
     async updateGotoUrl() {
        let url = new URLSearchParams();
        url.append("code", this.code || "");

        this.setGotoUrl(this.gotoUrl + "?" + url.toString());

        return this.gotoUrl;
    }

    @action.bound
    async updateKontaktinfo() {
        let response = await axios.post(API_BASE_URL + "/kontaktinfo",
            {code: this.current.code, email: this.current.email, mobile: this.current.mobile})

        if(response){
            this.code = response.data.code;
        }
    }

    @action.bound
    setKontaktinfo(response) {
        this.current = new Kontaktinfo(response);
    }

    @action.bound
    handleError(error) {
        this.error = error.response ? error.response : error;
        console.error("Problem with getting contact info: ", error);
    }

    @action.bound
    handleUpdateError(error) {
        this.error = error.response ? error.response : error;
        console.error("Problem with updating data: ", error);
    }
}

class Kontaktinfo {
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
}

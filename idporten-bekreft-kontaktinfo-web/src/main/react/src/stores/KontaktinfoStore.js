import {action, observable} from 'mobx';
import axios from "axios";
import {API_BASE_URL} from "../index";

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
    async updateKontaktinfo() {
        return await axios.post(API_BASE_URL + "/kontaktinfo",
            {code: this.current.code, email: this.current.email, mobile: this.current.mobile})
            .then((response) => this.code = response.data.code)
    }

    @action.bound
    async getKontaktinfo(code) {
        return await axios.get(API_BASE_URL + "/kontaktinfo/" + code)
            .then((response) => this.setKontaktinfo(response))
    }

    @action.bound
    async updateGotoUrl() {
        let url = new URLSearchParams();
        url.append("code", this.code || "");

        this.setGotoUrl(this.gotoUrl + "?" + url.toString());

        return this.gotoUrl;
    }

    @action.bound
    setGotoUrl(gotoUrlParam) {
        this.gotoUrl = gotoUrlParam;
    }

    @action.bound
    setCode(code) {
        this.code = code;
    }

    @action.bound
    setLanguage(lng) {
        this.language = lng;
        return this.language
    }

    @action.bound
    setKontaktinfo(response) {
        this.current = new Kontaktinfo(response.data);
    }
}



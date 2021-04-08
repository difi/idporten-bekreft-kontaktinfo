import {action, observable} from 'mobx';
import axios from "axios";
import { API_BASE_URL } from "../index";
import { Kontaktinfo } from "./Kontaktinfo"

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
    updateKontaktinfo() {
        return axios.post(API_BASE_URL + "/kontaktinfo",
            {code: this.current.code, email: this.current.email, mobile: this.current.mobile})
            .then((response) => this.code = response.data.code)
    }

    @action.bound
    getKontaktinfo(code) {
        return axios.get(API_BASE_URL + "/kontaktinfo/" + code)
            .then((response) => this.setKontaktinfo(response))
    }

    @action.bound
    updateGotoUrl() {
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



import {action, observable} from 'mobx';
import axios from "axios";
import {API_BASE_URL} from "../index";


export default class KontaktinfoStore {
    @observable kontaktinfo = {};
    @observable isLoading = false;
    @observable error = {};
    @observable gotoUrl = "";
    @observable code = "";

    @observable current = new Kontaktinfo();

    constructor(mainStore) {
        this.mainStore = mainStore;
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
    getKontaktinfo() {
    }

    @action.bound
    fetchKontaktinfo(fnr) {
        console.log("fetchKontaktinfo: " + (API_BASE_URL + "/kontaktinfo?" + fnr));
        return axios.get(API_BASE_URL + "/kontaktinfo/" + fnr)
            .then((response) => this.handleResponse(response))
            .catch((error) => this.handleError(error))
            .finally(() => {
                //do nothing
            });
    }

    @action.bound
    handleResponse(response) {
        console.log("kontaktinforesponse: " + response.data.kontaktinformasjon.epostadresse);
        this.current = new Kontaktinfo(response);
        //console.log("current: " + this.current);
        console.log(JSON.stringify(response))
    }

    @action.bound
    handleError(error) {
        this.error = error.response ? error.response : error;
        console.error("Problem with authorizations endpoint: ", error);
    }

    @action.bound
    handleReturnToIdporten() {
        axios.post(this.gotoUrl);
    }

    @action.bound
    configGoto(goto_url) {
        window.sessionStorage.clear();
        sessionStorage.setItem("goto_url", goto_url);
    }

    getGotoUrl() {
        sessionStorage.getItem("goto_url");
    }
}

class Kontaktinfo {

    @observable epost = "";
    @observable epostBekreftet = "";
    @observable mobilnr = "";
    @observable mobilnrBekreftet = "";
    @observable digitalPostkasse = "";
    @observable digitalPostkasseLeverandoer = "";
    @observable spraak = "";
    @observable reservasjon = "";
    @observable shouldUpdateKontaktinfo = false;

    constructor(data) {
        if(typeof data === "undefined") {
            return;
        }

        let kontaktinformasjon = data.data.kontaktinformasjon || {};
        this.epost = kontaktinformasjon.epostadresse || "";
        this.mobilnr = kontaktinformasjon.mobilnr || "";

        let digitalPost = data.data.digital_post || {};
        this.digitalPostkasse = digitalPost.postkasseadresse || "";
        this.digitalPostkasseLeverandoer = digitalPost.postkasseleverandoeradresse || "";

        this.spraak = data.spraak || "";
        this.reservasjon = data.reservasjon || "";
        this.shouldUpdateKontaktinfo = data.shouldUpdateKontaktinfo;

        console.log("this.epost: " + this.epost);
        console.log("kontaktinformasjon.epostadresse: " + kontaktinformasjon.epostadresse);
    }

}

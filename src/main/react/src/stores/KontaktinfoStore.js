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
    fetchKontaktinfo(code) {
        return axios.get(API_BASE_URL + "/kontaktinfo")
            .then((response) => this.handleResponse(response))
            .finally(() => {
                //do nothing
            });
    }

    // getAuthStub(resolve) {
    //     const stub ={ data: require("../test/stubs/get-authorizations")};
    //     return resolve(stub);
    // }

    @action.bound
    handleResponse(response) {
        this.current = new Kontaktinfo(response);
    }

    @action.bound
    handleError(error) {
        this.error = error.response ? error.response : error;
        console.error("Problem with authorizations endpoint: ", error);
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

    @observable epostadresse = "";
    @observable epostadresseGjentatt = "";
    @observable mobiltelefonnummer = "";
    @observable mobiltelefonnummerGjentatt = "";
    @observable digitalPostkasse = "";
    @observable digitalPostkasseLeverandoer = "";
    @observable spraak = "";
    @observable reservasjon = "";

    constructor(data) {
        if(typeof data === "undefined") {
            return;
        }

        let kontaktinformasjon = data.data.kontaktinformasjon || {};
        this.epostadresse = kontaktinformasjon.epostadresse || "";
        this.mobiltelefonnummer = kontaktinformasjon.mobiltelefonnummer || "";

        let digitalPost = data.data.digital_post || {};
        this.digitalPostkasse = digitalPost.postkasseadresse || "";
        this.digitalPostkasseLeverandoer = digitalPost.postkasseleverandoeradresse || "";

        this.spraak = data.spraak || "";
        this.reservasjon = data.reservasjon || "";
    }

}
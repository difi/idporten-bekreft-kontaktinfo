import {action, observable} from 'mobx';


export default class KontaktinfoStore {
    @observable kontaktinfo = {};
    @observable isLoading = false;
    @observable error = {};
    @observable gotoUrl = "";
    @observable code = "";

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

    // getAuthStub(resolve) {
    //     const stub ={ data: require("../test/stubs/get-authorizations")};
    //     return resolve(stub);
    // }

    @action.bound
    handleResponse(response) {
        this.kontaktinfo = new Kontaktinfo(response);
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

    @observable epost = "";
    @observable mobilnr = "";
    @observable digitalPostkasse = "";
    @observable digitalPostkasseLeverandoer = "";
    @observable spraak = "";
    @observable reservasjon = "";

    constructor(data) {
        if(typeof data === "undefined") {
            return;
        }

        let kontaktinformasjon = data.kontaktinformasjon || {};
        this.epost = kontaktinformasjon.epostadresse || "";
        this.mobilnr = kontaktinformasjon.mobiltelefonnummer || "";

        let digitalPost = data.digital_post || {};
        this.digitalPostkasse = digitalPost.postkasseadresse || "";
        this.digitalPostkasseLeverandoer = digitalPost.postkasseleverandoeradresse || "";

        this.spraak = data.spraak || "";
        this.reservasjon = data.reservasjon || "";
    }

}

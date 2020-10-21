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
        //console.log("SetGotoUrl:" + this.gotoUrl);
    }

    @action.bound
    setCode(code) {
        this.code = code;
    }

    @action.bound
    getKontaktinfo() {
    }

    @action.bound
    getKontaktinfoForGotoUrl() {
        // Digitalt kontakt- og reservasjonsregister internal property names for SAML attributes
        console.log("getKontaktinfoForGotoUrl-" + this.gotoUrl);
        // console.log(new URLSearchParams(this.gotoUrl).toString());
        // console.log(new URLSearchParams(this.gotoUrl));
        // console.log(new URLSearchParams(this.gotoUrl.toString()).toString());
        // console.log(new URLSearchParams(this.gotoUrl.toString()));
        let url = new URLSearchParams();
        url.append("digitalcontactregister-reserved", this.current.reservasjon || "");
        url.append("digitalcontactregister-postboxoperator", this.current.digitalPostkasseLeverandoer || "");
        url.append("digitalcontactregister-email", this.current.email || "");
        url.append("digitalcontactregister-mobile", this.current.mobile || "");
        url.append("digitalcontactregister-status", this.current.status || "");
        console.log("det er " + url.toString());
        this.setGotoUrl(this.gotoUrl + "&" + url.toString());
        console.log(this.gotoUrl);
        // let url = new URLSearchParams(this.gotoUrl);
        console.log("og slutt");
        return url.toString();
    }

    @action.bound
    fetchKontaktinfo(fnr) {
        console.log("fetchKontaktinfo: " + (API_BASE_URL + "/kontaktinfo?" + fnr));
        this.isLoading = true;
        return axios.get(API_BASE_URL + "/kontaktinfo/" + fnr)
            .then((response) => this.handleResponse(response))
            .catch((error) => this.handleError(error))
            .finally(() => {
                this.isLoading = false;
            });
    }

    @action.bound
    updateKontaktinfo() {
        return axios.post(API_BASE_URL + "/kontaktinfo",
            {fnr: this.current.fnr, email: this.current.email, mobile: this.current.mobile})
            .catch((error) => this.handleUpdateError(error));
    }

    @action.bound
    handleResponse(response) {
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
    @observable fnr = "";
    @observable email = "";
    @observable emailConfirmed = "";
    @observable mobile = "";
    @observable mobileConfirmed = "";
    @observable digitalPostkasse = "";
    @observable digitalPostkasseLeverandoer = "";
    @observable spraak = "";
    @observable reservasjon = "";
    @observable shouldUpdateKontaktinfo = false;
    @observable history = {
        "email":"",
        "mobile":""
    };

    constructor(data) {
        if(typeof data === "undefined") {
            return;
        }

        this.fnr = data.data.personIdentifikator || "";
        this.email = data.data.email || "";
        this.emailConfirmed = data.data.email || "";
        this.mobile = data.data.mobile || "";
        this.mobileConfirmed = data.data.mobile || "";

        this.history = {
            "email" : data.data.email || "",
            "mobile" : data.data.mobile || ""
        };

        let digitalPost = data.data.digital_post || {};
        this.digitalPostkasse = digitalPost.postkasseadresse || "";
        this.digitalPostkasseLeverandoer = digitalPost.postkasseleverandoeradresse || "";

        this.spraak = data.spraak || "";
        this.reservasjon = data.reservasjon || "";
        this.shouldUpdateKontaktinfo = data.shouldUpdateKontaktinfo;
    }
}

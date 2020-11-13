import {action, observable} from 'mobx';
import axios from "axios";
import {API_BASE_URL} from "../index";

export default class KontaktinfoStore {
    @observable kontaktinfo = {};
    @observable error = {};
    @observable gotoUrl = "";
    @observable current = new Kontaktinfo();

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @action.bound
    setGotoUrl(gotoUrlParam) {
        this.gotoUrl = gotoUrlParam;
    }

    @action.bound
     async updateGotoUrl() {
        let url = new URLSearchParams();
        url.append("digitalcontactregister-reserved", "");
        url.append("digitalcontactregister-postboxoperator", "");
        url.append("digitalcontactregister-status", "");

        url.append("digitalcontactregister-email", this.current.email || "");
        url.append("digitalcontactregister-mobile", this.current.mobile || "");

        this.setGotoUrl(this.gotoUrl + "&" + url.toString());

        return this.gotoUrl;
    }

    @action.bound
    updateKontaktinfo() {
        return axios.post(API_BASE_URL + "/kontaktinfo",
            {uuid: this.current.uuid, email: this.current.email, mobile: this.current.mobile})
            .catch((error) => this.handleUpdateError(error));
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
    @observable uuid = "";

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

        this.uuid = data.uuid || "";
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

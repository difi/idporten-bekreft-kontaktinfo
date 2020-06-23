import {action, observable} from 'mobx';
import axios from 'axios';


class KontaktinfoStore {
    @observable kontaktinfo = {};
    @observable isLoading = false;
    @observable error = {};

    @action.bound
    getKontaktinfo() {

        this.isLoading = true;
        this.error = {};
        return axios.get(window.env.kontaktinfo.endpoint)
        //return new Promise(resolve => this.getAuthStub(resolve))
            .then((response) => this.handleResponse(response))
            .catch((error) => this.handleError(error))
            .finally( () => {this.isLoading = false});
    }

    getAuthStub(resolve) {
        const stub ={ data: require("../test/stubs/get-authorizations")};
        return resolve(stub);
    }

    @action.bound
    handleResponse(response) {
        this.kontaktinfo = new Kontaktinfo(response);
    }

    @action.bound
    handleError(error) {
        this.error = error.response ? error.response : error;
        console.error("Problem with authorizations endpoint: ", error);
    }
}

export class Kontaktinfo {

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

        this.epost = data.kontaktinformasjon.epostadresse;
        this.mobilnr = data.kontaktinformasjon.mobiltelefonnummer;
        this.digitalPostkasse = data.digital_post.postkasseadresse;
        this.digitalPostkasseLeverandoer = data.digital_post.postkasseleverandoeradresse;
        this.spraak = data.spraak;
        this.reservasjon = data.reservasjon;
    }

}

const kontaktinfoStore = new KontaktinfoStore();

export default kontaktinfoStore;
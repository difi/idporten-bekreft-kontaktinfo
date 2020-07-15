import {action, observable} from "mobx";
import axios from 'axios';
import {API_BASE_URL} from "../index";


export default class UIStore {
    @observable loadingCount = 0;

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @action.bound
    setLoading(loading) {
        if(loading) {
            this.loadingCount = this.loadingCount + 1;
        } else {
            this.loadingCount = this.loadingCount - 1;
        }
    }

    // @action.bound
    // loadConfig() {
    //     this.setLoading(true);
    //     return axios.get(API_BASE_URL + "/config")
    //         .then((response) => {
    //             this.features = new Features(response.data.features);
    //         })
    //         .catch((error) => {
    //             this.handleError(error);
    //             return new Promise((resolve, reject) => {
    //                 reject(error);
    //             });
    //         })
    //         .finally(() => {
    //             this.setLoading(false);
    //         });
    // }


    @action.bound
    handleError(error) {
        this.mainStore.errorHandler.handleError(error);
    }

}


class Features {
    @observable codeVerficationEmailEnabled = false;
    @observable codeVerficationMobileEnabled = false;

    constructor(data) {
        if (typeof data === "undefined") {
            return;
        }

        this.codeVerficationMobileEnabled = data.verify_mobile;
        this.codeVerficationEmailEnabled = data.verify_email;
    }
}

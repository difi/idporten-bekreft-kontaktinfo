import { Component } from 'react';
import {API_BASE_URL} from "../index";

class Validator extends Component {
    MOBILE_DELETE_WARNING = "info.sletteMobilVarsel"
    MOBILE_ERROR = "error.mobileError"
    MOBILE_REPEAT_ERROR = "error.mobileRepeatError"
    EMAIL_ERROR = "error.emailError"
    EMAIL_REPEAT_ERROR = "error.emailRepeatError"
    ALL_CONTACT_INFO_REMOVED = "error.allContactInfoIsRemoved"

    validateMobile(current) {

        return new Promise( (resolve, reject) => {

            if(this.preventUserFromDeletingAllContactInfo(current)) {
                reject(this.ALL_CONTACT_INFO_REMOVED);
            }

            if(current.mobile.length){

                if (current.mobileConfirmed && current.mobile !== current.mobileConfirmed){
                    reject(this.MOBILE_REPEAT_ERROR);
                }

                fetch(API_BASE_URL + "/validate/mobile/" + current.mobile)
                    .then(response => response.json())
                    .then(data => {
                        if(!data.valid){
                            reject(this.MOBILE_ERROR)
                        } else (
                            resolve()
                        )
                    })
            } else {
                resolve()
            }
        })
    }

    validateEmail(current){

        return new Promise( (resolve, reject) => {

            if(this.preventUserFromDeletingAllContactInfo(current)) {
                reject(this.ALL_CONTACT_INFO_REMOVED);
            }

            if(current.email.length){

                if (current.emailConfirmed && current.email !== current.emailConfirmed){
                    reject(this.EMAIL_REPEAT_ERROR);
                }

                fetch(API_BASE_URL + "/validate/email/" + current.email)
                    .then(response => response.json())
                    .then(data => {
                        if(!data.valid){
                            reject(this.EMAIL_ERROR)
                        } else (
                            resolve()
                        )
                    })
            } else {
                resolve()
            }
        })
    }

    validateEmailAndMobile(current){
        return new Promise( (resolve, reject) => {
            this.validateEmail(current)
                .then(() => {
                    this.validateMobile(current)
                        .then(() => {
                            resolve()
                        })
                        .catch(error =>
                            reject(error)
                        )
                })
                .catch(error =>
                    reject(error)
                )
        })
    }

    /* custom for idk */
    isMobileRemoved(current){
        if(current.history.mobile.length > 0 && current.mobile.length === 0){
            return this.MOBILE_DELETE_WARNING;
        }
    }

    preventUserFromDeletingAllContactInfo(current){
        if(current.history.email.length > 0 || current.history.mobile.length > 0) {
            if(current.email.length === 0 && current.mobile.length === 0){
                return true;
            }
        }

        return false;
    }
}

export default new Validator();
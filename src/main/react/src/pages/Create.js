import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

import autobind from "autobind-decorator";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import DigdirButtons from "../common/DigdirButtons";
import SynchedInput from "../common/SynchedInput";
import kontaktinfoStore from "../stores/KontaktinfoStore";
import ContentHeader from "../common/ContentHeader";
import ContentInfoBox from "../common/ContentInfoBox";
import {observable} from "mobx";

@inject("kontaktinfoStore")
@observer
class Create extends Component {

    @observable displayEmailValidationError = false;
    @observable displayMobileValidationError = false;

    getTitle() {
        return "Opprett kontaktinformasjon";
    }

    @autobind
    compareMobile(e) {
        const mobile = this.props.kontaktinfoStore.current.mobile;
        const mobileConfirmed = this.props.kontaktinfoStore.current.mobileConfirmed;

        if(mobile.length){
            if(!mobile.replace(/\s+/g, '').match("^([+][0-9]{2})?[0-9]{8}$")){
                this.mobileValidationError = true;
                return;
            }
        }

        this.mobileValidationError = !(mobile === mobileConfirmed);
    }

    @autobind
    compareEmail(e) {
        const email = this.props.kontaktinfoStore.current.email;
        const emailConfirmed = this.props.kontaktinfoStore.current.emailConfirmed;

        if (email.length && !(email.match(".*@.*")) ) {
            this.emailValidationError = true;
            return;
        }

        this.emailValidationError = !(email === emailConfirmed);
    }

    @autobind
    handleSubmit(e) {
        if(this.emailValidationError){
            e.preventDefault();
            this.displayEmailValidationError=true;
            return false;
        } else if (this.mobileValidationError) {
            e.preventDefault();
            this.displayMobileValidationError=true;
            return false;
        } else {
            const mobile = this.props.kontaktinfoStore.current.mobile;
            const email = this.props.kontaktinfoStore.current.email;

            this.props.kontaktinfoStore.getKontaktinfoForGotoUrl();

            if(mobile.length !== 0 || email.length !== 0){
                this.props.kontaktinfoStore.updateKontaktinfo();
            }
        }
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title={this.getTitle()}/>

                { this.displayEmailValidationError && <ContentInfoBox textKey="error.emailError" state="error"  /> }
                { this.displayMobileValidationError && <ContentInfoBox textKey="error.mobileError" state="error"  /> }

                <ContentInfoBox textKey="info.manglendeInformasjon"  />
                <DigdirForm id="confirmContactinfo"
                            method="post" action={this.props.kontaktinfoStore.gotoUrl} onSubmit={this.handleSubmit}>

                    <SynchedInput
                        tabIndex="1"
                        id="idporten.input.CONTACTINFO_EMAIL"
                        name="idporten.input.CONTACTINFO_EMAIL"
                        source={current}
                        path="email"
                        textKey="field.email"
                        onChangeCallback={this.compareEmail()}
                        error={this.displayEmailValidationError}/>

                    <SynchedInput
                        tabIndex="2"
                        error={this.displayEmailValidationError}
                        id="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        name="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        source={current}
                        path="emailConfirmed"
                        textKey="field.emailConfirmed"
                        onChangeCallback={this.compareEmail()}/>

                    <SynchedInput
                        tabIndex="3"
                        error={this.displayMobileValidationError}
                        id="idporten.input.CONTACTINFO_MOBILE"
                        name="idporten.input.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobile"
                        textKey="field.mobile"
                        onChangeCallback={this.compareMobile()}/>

                    <SynchedInput
                        tabIndex="4"
                        error={this.displayMobileValidationError}
                        id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobileConfirmed"
                        textKey="field.mobileConfirmed"
                        onChangeCallback={this.compareEmail()}/>

                    <DigdirButtons>
                        <DigdirButton
                            tabIndex="5"
                            type="submit"
                            textKey="button.next"/>
                    </DigdirButtons>

                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default Create;
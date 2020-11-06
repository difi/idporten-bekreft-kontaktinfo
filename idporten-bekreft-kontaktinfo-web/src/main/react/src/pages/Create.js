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
import Validator from "../components/Validator";

@inject("kontaktinfoStore")
@observer
class Create extends Component {
    @observable errorEmail = null;
    @observable errorMobile = null;

    @autobind
    handleSubmit(e) {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        this.errorEmail = Validator.validateEmail(current)
        this.errorMobile = Validator.validateMobile(current)

        if(this.errorEmail){
            e.preventDefault();
            return false;
        } else if (this.errorMobile) {
            e.preventDefault();
            return false;
        } else {
            const mobile = current.mobile;
            const email = current.email;

            this.props.kontaktinfoStore.getKontaktinfoForGotoUrl();

            // dont create user if no data is provided
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
                <ContentHeader title="title" sub_title="page_title.create"/>

                { this.errorEmail && <ContentInfoBox content={this.errorEmail} state="error"  /> }
                { this.errorMobile && <ContentInfoBox content={this.errorMobile} state="error"  /> }

                <ContentInfoBox content="info.manglendeInformasjon"  />

                <DigdirForm id="confirmContactinfo"
                            method="post" action={this.props.kontaktinfoStore.gotoUrl} onSubmit={this.handleSubmit}>

                    <SynchedInput
                        tabIndex="1"
                        id="idporten.input.CONTACTINFO_EMAIL"
                        name="idporten.input.CONTACTINFO_EMAIL"
                        source={current}
                        path="email"
                        textKey="field.email"
                        error={this.errorEmail != null}/>

                    <SynchedInput
                        tabIndex="2"
                        id="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        name="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        source={current}
                        path="emailConfirmed"
                        textKey="field.emailConfirmed"
                        error={this.errorEmail != null}/>

                    <SynchedInput
                        tabIndex="3"
                        id="idporten.input.CONTACTINFO_MOBILE"
                        name="idporten.input.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobile"
                        textKey="field.mobile"
                        error={this.errorMobile != null}/>

                    <SynchedInput
                        tabIndex="4"
                        id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobileConfirmed"
                        textKey="field.mobileConfirmed"
                        error={this.errorMobile != null}/>

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
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

@inject("kontaktinfoStore")
@observer
class Create extends Component {

    getTitle() {
        return "Opprett kontaktinformasjon";
    }

    @autobind
    compareMobile(e) {
        const mobile = this.props.kontaktinfoStore.current.mobile;
        const mobileConfirmed = this.props.kontaktinfoStore.current.mobileConfirmed;
        this.mobileMatch = !(mobile === mobileConfirmed);
    }

    @autobind
    compareEmail(e) {
        const email = this.props.kontaktinfoStore.current.email;
        const emailConfirmed = this.props.kontaktinfoStore.current.emailConfirmed;

        if (email.length && !(email.match(".*@.*")) ) {
            this.emailMatch = true;
            return;
        }

        this.emailMatch = !(email === emailConfirmed);
    }

    @autobind
    handleSubmit() {
        this.props.kontaktinfoStore.getKontaktinfoForGotoUrl();
        this.props.kontaktinfoStore.updateKontaktinfo();
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title={this.getTitle()}/>
                <ContentInfoBox textKey="info.manglendeInformasjon"  />
                <DigdirForm id="confirmContactinfo"
                            method="post" action={this.props.kontaktinfoStore.gotoUrl} onSubmit={this.handleSubmit}>

                    <SynchedInput
                        tabindex="1"
                        id="idporten.input.CONTACTINFO_EMAIL"
                        name="idporten.input.CONTACTINFO_EMAIL"
                        source={current}
                        path="email"
                        textKey="field.email"
                        onChangeCallback={this.compareEmail()}/>

                    <SynchedInput
                        tabindex="2"
                        id="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        name="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        source={current}
                        path="emailConfirmed"
                        textKey="field.emailConfirmed"
                        onChangeCallback={this.compareEmail()}/>

                    <SynchedInput
                        tabindex="3"
                        id="idporten.input.CONTACTINFO_MOBILE"
                        name="idporten.input.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobile"
                        textKey="field.mobile"
                        onChangeCallback={this.compareMobile()}/>

                    <SynchedInput
                        tabindex="4"
                        id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobileConfirmed"
                        textKey="field.mobileConfirmed"
                        onChangeCallback={this.compareEmail()}/>

                    <DigdirButtons>
                        <DigdirButton
                            tabindex="5"
                            disabled={this.emailMatch || this.mobileMatch }
                            type="submit"
                            textKey="button.confirm"/>
                    </DigdirButtons>

                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default Create;
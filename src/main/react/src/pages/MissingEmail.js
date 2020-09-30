import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

import autobind from "autobind-decorator";
import DigdirButtons from "../common/DigdirButtons";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import ContentInfoBox from "../common/ContentInfoBox";
import kontaktinfoStore from "../stores/KontaktinfoStore";
import SynchedInput from "../common/SynchedInput";
import {observable} from "mobx";
import ContentHeader from "../common/ContentHeader";
import ContentInfo from "../common/ContentInfo";

@inject("kontaktinfoStore")
@observer
class MissingEmail extends Component {
    @observable confirmDisabled = true;
    @observable oldEmail = "";

    getTitle() {
        return "Din e-postadresse";
    }

    componentDidMount() {
        this.oldEmail = this.props.kontaktinfoStore.current.email;
    }

    @autobind
    handleCommit() {
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    handleCancel() {
        this.props.kontaktinfoStore.current.email = this.oldEmail;
        this.props.kontaktinfoStore.current.emailConfirmed = this.oldEmail;
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    validateEmailRepeated() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        if (!(current.email.match(".*@.*"))) {
            this.confirmDisabled = true;
            return;
        }
        this.confirmDisabled = !(current.emailConfirmed === current.email);
    }

    render() {
        const current = this.props.kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title={this.getTitle()}/>

                <ContentInfoBox textKey="info.manglendeEpostVarsel"  />
                <ContentInfo textKey="info.manglendeEpostLabel" />

                <DigdirForm
                    id="confirmContactinfo"
                    onSubmitCallback={this.handleCommit}>

                    <SynchedInput
                        tabindex="1"
                        id="idporten.input.CONTACTINFO_EMAIL"
                        name="idporten.input.CONTACTINFO_EMAIL"
                        source={current}
                        path="email"
                        textKey="field.email"
                        onChangeCallback={this.validateEmailRepeated}/>

                    <SynchedInput
                        tabindex="2"
                        id="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        name="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        source={current}
                        path="emailConfirmed"
                        textKey="field.emailConfirmed"
                        onChangeCallback={this.validateEmailRepeated}/>

                    <DigdirButtons>
                        <DigdirButton
                            tabindex="3"
                            id="idporten.inputbutton.NEXT"
                            name="idporten.inputbutton.NEXT"
                            disabled={this.confirmDisabled}
                            type="submit"
                            value="submit"
                            textKey="button.confirm" />

                        <DigdirButton
                            tabindex="4"
                            id="idporten.inputbutton.SKIP"
                            name="idporten.inputbutton.SKIP"
                            type="submit"
                            value="skip"
                            data-white="true"
                            onClick={this.handleCancel} textKey="button.skip" />


                    </DigdirButtons>
                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default MissingEmail;
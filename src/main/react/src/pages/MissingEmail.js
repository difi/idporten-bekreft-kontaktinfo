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
    @observable errorMessage = "";
    @observable emailValidationError = true;
    @observable displayEmailValidationError = false;
    @observable oldEmail = "";

    componentDidMount() {
        this.oldEmail = this.props.kontaktinfoStore.current.email;
    }

    @autobind
    handleSubmit() {
        if (this.emailValidationError){
            this.displayEmailValidationError = true;
        } else {
            this.props.history.push('/kontaktinfo');
        }
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

        if (current.email.length && !(current.email.match(".*@.*"))) {
            this.errorMessage = "error.emailError"
            this.emailValidationError = true;
            return;
        }

        this.errorMessage = "error.emailRepeatError"
        this.emailValidationError = !(current.emailConfirmed === current.email);
    }

    render() {
        const current = this.props.kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title="title" sub_title="page_title.edit_email"/>

                { this.displayEmailValidationError && <ContentInfoBox content={this.errorMessage} state="error"  /> }

                <ContentInfoBox content="info.manglendeEpostVarsel"  />
                <ContentInfo content="info.manglendeEpostLabel" />

                <DigdirForm
                    id="confirmContactinfo"
                    onSubmitCallback={this.handleCommit}>

                    <SynchedInput
                        tabIndex="1"
                        error={this.displayEmailValidationError}
                        id="idporten.input.CONTACTINFO_EMAIL"
                        name="idporten.input.CONTACTINFO_EMAIL"
                        source={current}
                        path="email"
                        textKey="field.email"
                        onChangeCallback={this.validateEmailRepeated}/>

                    <SynchedInput
                        tabIndex="2"
                        error={this.displayEmailValidationError}
                        id="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        name="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        source={current}
                        path="emailConfirmed"
                        textKey="field.emailConfirmed"
                        onChangeCallback={this.validateEmailRepeated}/>

                    <DigdirButtons>
                        <DigdirButton
                            tabIndex="3"
                            id="idporten.inputbutton.NEXT"
                            name="idporten.inputbutton.NEXT"
                            onClick={this.handleSubmit}
                            type="submit"
                            value="submit"
                            textKey="button.next" />

                        <DigdirButton
                            tabIndex="4"
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
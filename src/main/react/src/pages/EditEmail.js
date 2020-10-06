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

@inject("kontaktinfoStore")
@observer
class EditEmail extends Component {
    @observable confirmDisabled = false;
    @observable oldEmail = "";

    getTitle() {
        return "Din e-postadresse";
    }

    componentDidMount() {
        this.oldEmail = this.props.kontaktinfoStore.current.email;
    }

    @autobind
    handleSubmit() {
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

        if (current.email.length && !(current.email.match(".*@.*"))) {
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

                <DigdirForm
                    id="confirmContactinfo"
                    onSubmitCallback={this.handleSubmit}>

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
                            disabled={this.confirmDisabled}
                            id="idporten.inputbutton.SAVE"
                            name="idporten.inputbutton.SAVE"
                            type="submit"
                            value="submit"
                            textKey="button.save" />

                        <DigdirButton
                            tabindex="4"
                            id="idporten.inputbutton.CANCEL_SAVE"
                            name="idporten.inputbutton.CANCEL_SAVE"
                            type="submit"
                            value="cancel"
                            data-white="true"
                            onClick={this.handleCancel}
                            textKey="button.cancel" />

                    </DigdirButtons>
                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default EditEmail;
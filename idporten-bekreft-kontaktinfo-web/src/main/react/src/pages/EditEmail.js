import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import autobind from "autobind-decorator";
import DigdirButtons from "../common/DigdirButtons";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import ContentInfoBox from "../common/ContentInfoBox";
import SynchedInput from "../common/SynchedInput";
import {observable} from "mobx";
import ContentHeader from "../common/ContentHeader";
import Validator from "../components/Validator"
import PageWrapper from "../common/Page";

@inject("kontaktinfoStore")
@observer
class EditEmail extends Component {
    @observable errorMessage = null;

    @autobind
    handleSubmit() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        Validator.validateEmail(current).then(response => {
            this.errorMessage = response;

            if(!this.errorMessage){
                this.props.kontaktinfoStore.current.history.email = current.email;
                this.props.history.push('/kontaktinfo');
            }
        });
    }

    @autobind
    handleCancel() {
        const current = this.props.kontaktinfoStore.current
        current.email = current.history.email;
        current.emailConfirmed = current.email;
        this.props.history.push('/kontaktinfo');
    }

    render() {
        const current = this.props.kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader page_title="page_title.edit_email"/>

                <PageWrapper>
                    { this.errorMessage && <ContentInfoBox content={this.errorMessage} state="error"  /> }

                    <DigdirForm
                        id="confirmContactinfo"
                        onSubmitCallback={this.handleSubmit}>

                        <SynchedInput
                            error={this.errorMessage != null}
                            id="idporten.input.CONTACTINFO_EMAIL"
                            name="idporten.input.CONTACTINFO_EMAIL"
                            source={current}
                            path="email"
                            textKey="field.email"
                            />

                        <SynchedInput
                            error={this.errorMessage != null}
                            id="idporten.inputrepeat.CONTACTINFO_EMAIL"
                            name="idporten.inputrepeat.CONTACTINFO_EMAIL"
                            source={current}
                            path="emailConfirmed"
                            textKey="field.emailConfirmed"
                            />

                        <DigdirButtons>
                            <DigdirButton
                                tabIndex="80"
                                id="idporten.inputbutton.SAVE"
                                name="idporten.inputbutton.SAVE"
                                type="submit"
                                value="submit"
                                textKey="button.save" />

                            <DigdirButton
                                tabIndex="81"
                                id="idporten.inputbutton.CANCEL_SAVE"
                                name="idporten.inputbutton.CANCEL_SAVE"
                                type="submit"
                                value="cancel"
                                data-white="true"
                                onClick={this.handleCancel}
                                textKey="button.cancel" />

                        </DigdirButtons>
                    </DigdirForm>
                </PageWrapper>
            </React.Fragment>
        );
    }
}

export default EditEmail;
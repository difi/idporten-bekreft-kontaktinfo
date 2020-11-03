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
import Validator from "../components/Validator";

@inject("kontaktinfoStore")
@observer
class MissingEmail extends Component {
    @observable error = null;

    @autobind
    handleSubmit() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        this.error = Validator.validateEmail(current)

        if(!this.error){
            this.props.history.push('/kontaktinfo');
        }
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
                <ContentHeader title="title" sub_title="page_title.edit_email"/>

                { this.error && <ContentInfoBox content={this.error} state="error"  /> }

                <ContentInfoBox content="info.manglendeEpostVarsel"  />
                <ContentInfo content="info.manglendeEpostLabel" />

                <DigdirForm
                    id="confirmContactinfo"
                    onSubmitCallback={this.handleCommit}>

                    <SynchedInput
                        tabIndex="1"
                        error={this.error}
                        id="idporten.input.CONTACTINFO_EMAIL"
                        name="idporten.input.CONTACTINFO_EMAIL"
                        source={current}
                        path="email"
                        textKey="field.email"
                        />

                    <SynchedInput
                        tabIndex="2"
                        error={this.error}
                        id="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        name="idporten.inputrepeat.CONTACTINFO_EMAIL"
                        source={current}
                        path="emailConfirmed"
                        textKey="field.emailConfirmed"
                        />

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
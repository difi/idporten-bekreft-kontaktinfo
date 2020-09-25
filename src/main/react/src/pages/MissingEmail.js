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
        this.confirmDisabled = !(current.email.length > 0 && current.emailConfirmed === current.email);
    }

    render() {
        const current = this.props.kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title={this.getTitle()}/>

                <ContentInfoBox textKey="info.manglendeEpostVarsel"  />
                <ContentInfo textKey="info.manglendeEpostLabel" />

                <DigdirForm id="confirmContactinfo"
                            onSubmitCallback={this.handleCommit}>
                    <SynchedInput id="email" source={current} path="email"
                                  textKey="field.email" onChangeCallback={this.validateEmailRepeated}/>
                    <SynchedInput id="epostBekreftet" source={current} path="emailConfirmed"
                                  textKey="field.emailConfirmed" onChangeCallback={this.validateEmailRepeated}/>
                    <DigdirButtons>
                        <DigdirButton disabled={this.confirmDisabled} type="submit"
                                      value="submit" textKey="button.confirm" />
                        <DigdirButton type="submit" value="skip"
                                      data-white="true" onClick={this.handleCancel} textKey="button.skip" />
                    </DigdirButtons>
                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default MissingEmail;
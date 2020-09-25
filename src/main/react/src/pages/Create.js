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
    handleCommit() {
        this.props.history.push('/kontaktinfo');
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

        if (!(email.match(".*@.*")) ) {
            this.emailMatch = true;
            return;
        }

        this.emailMatch = !(email === emailConfirmed);
    }

    @autobind
    handleCancel(e) {

        // TODO: redirect to idporten ?? no need to confirm information
        this.props.kontaktinfoStore.current.email = this.oldEmail;
        this.props.kontaktinfoStore.current.emailConfirmed = this.oldEmail;
        this.props.kontaktinfoStore.current.mobile = this.oldMobile;
        this.props.kontaktinfoStore.current.mobileConfirmed = this.oldMobile;
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title={this.getTitle()}/>
                <ContentInfoBox textKey="info.manglendeInformasjon"  />
                <DigdirForm id="confirmContactinfo"
                            onSubmitCallback={this.handleCommit}>

                    <SynchedInput id="email" source={current} path="email"
                                  textKey="field.email" onChangeCallback={this.compareEmail()}/>

                    <SynchedInput id="emailConfirmed" source={current} path="emailConfirmed"
                                  textKey="field.emailConfirmed" onChangeCallback={this.compareEmail()}/>

                    <SynchedInput id="mobile" source={current} path="mobile"
                                  textKey="field.mobile" onChangeCallback={this.compareMobile()}/>

                    <SynchedInput id="mobileConfirmed" source={current} path="mobileConfirmed"
                                  textKey="field.mobileConfirmed" onChangeCallback={this.compareEmail()}/>

                    <DigdirButtons>
                        <DigdirButton disabled={this.emailMatch || this.mobileMatch }
                                      type="submit" textKey="button.next"/>

                        <DigdirButton type="submit" value="skip" data-white="true"
                                      onClick={this.handleCancel} textKey="button.skip" />
                    </DigdirButtons>

                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default Create;
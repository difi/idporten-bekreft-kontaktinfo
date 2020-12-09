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
import PageWrapper from "../common/Page";

@inject("kontaktinfoStore")
@observer
class MissingMobile extends Component {
    @observable errorMessage = null;

    @autobind
    handleCommit() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        Validator.validateMobile(current).then(response => {
            this.errorMessage = response;

            if(!this.errorMessage){
                this.props.kontaktinfoStore.current.history.mobile = current.mobile;
                this.props.history.push('/kontaktinfo');
            }
        });
    }

    @autobind
    handleCancel() {
        const current = this.props.kontaktinfoStore.current
        current.mobile = current.history.mobile;
        current.mobileConfirmed = current.mobile;

        this.props.history.push('/kontaktinfo');
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader page_title="page_title.edit_mobile"/>

                <PageWrapper>
                    { this.errorMessage && <ContentInfoBox content={this.errorMessage} state="error"  /> }

                    <ContentInfoBox content="info.manglendeMobilVarsel"  />
                    <ContentInfo content="info.manglendeMobilLabel" />

                    <DigdirForm id="editMobilnr" onSubmitCallback={this.handleCommit}>
                        <SynchedInput
                            error={this.errorMessage != null}
                            id="idporten.input.CONTACTINFO_MOBILE"
                            name="idporten.input.CONTACTINFO_MOBILE"
                            source={current}
                            path="mobile"
                            textKey="field.mobile"
                            />

                        <SynchedInput
                            error={this.errorMessage != null}
                            id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                            name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                            source={current}
                            path="mobileConfirmed"
                            textKey="field.mobileConfirmed"
                            />

                        <DigdirButtons>
                            <DigdirButton
                                tabIndex="80"
                                onClick={this.handleSubmit}
                                type="submit"
                                value="submit"
                                textKey="button.next"
                                id="idporten.inputbutton.NEXT"
                                name="idporten.inputbutton.NEXT"/>

                            <DigdirButton
                                tabIndex="81"
                                type="submit"
                                value="skip"
                                data-white="true"
                                onClick={this.handleCancel}
                                textKey="button.skip"
                                id="idporten.inputbutton.SKIP"
                                name="idporten.inputbutton.SKIP"/>
                        </DigdirButtons>
                    </DigdirForm>
                </PageWrapper>
            </React.Fragment>
        );
    }
}

export default MissingMobile;
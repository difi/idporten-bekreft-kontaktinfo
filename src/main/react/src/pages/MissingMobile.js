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
class MissingMobile extends Component {
    @observable confirmDisabled = true;
    @observable oldMobile = "";

    getTitle() {
        return "Ditt mobilnummer";
    }

    componentDidMount() {
        this.oldMobile = this.props.kontaktinfoStore.current.mobile;
    }

    @autobind
    handleCommit() {
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    handleCancel() {
        this.props.kontaktinfoStore.current.mobile = this.oldMobile;
        this.props.kontaktinfoStore.current.mobileConfirmed = this.oldMobile;
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    validateMobileRepeated() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        if(!current.mobile.replace(/\s+/g, '').match("^([+][0-9]{2})?[0-9]{8}$")){
            this.confirmDisabled = true;
            return;
        }

        this.confirmDisabled = !(current.mobileConfirmed === current.mobile);
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title={this.getTitle()}/>

                <ContentInfoBox textKey="info.manglendeMobilVarsel"  />
                <ContentInfo textKey="info.manglendeMobilLabel" />

                <DigdirForm id="editMobilnr" onSubmitCallback={this.handleCommit}>
                    <SynchedInput
                        tabindex="1"
                        id="idporten.input.CONTACTINFO_MOBILE"
                        name="idporten.input.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobile"
                        textKey="field.mobile"
                        onChangeCallback={this.validateMobileRepeated}
                    />
                    <SynchedInput
                        tabindex="2"
                        id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobileConfirmed"
                        textKey="field.mobileConfirmed"
                        onChangeCallback={this.validateMobileRepeated}
                    />
                    <DigdirButtons>
                        <DigdirButton
                            tabindex="3"
                            disabled={this.confirmDisabled}
                            type="submit"
                            value="submit"
                            textKey="button.confirm"
                            id="idporten.inputbutton.NEXT"
                            name="idporten.inputbutton.NEXT"
                        />

                        <DigdirButton
                            tabindex="4"
                            type="submit"
                            value="skip"
                            data-white="true"
                            onClick={this.handleCancel}
                            textKey="button.skip"
                            id="idporten.inputbutton.SKIP"
                            name="idporten.inputbutton.SKIP"
                        />
                    </DigdirButtons>
                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default MissingMobile;
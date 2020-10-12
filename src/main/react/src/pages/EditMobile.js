import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

import autobind from "autobind-decorator";
import DigdirButtons from "../common/DigdirButtons";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import kontaktinfoStore from "../stores/KontaktinfoStore";
import SynchedInput from "../common/SynchedInput";
import {observable} from "mobx";
import ContentHeader from "../common/ContentHeader";
import ContentInfoBox from "../common/ContentInfoBox";

@inject("kontaktinfoStore")
@observer
class EditMobile extends Component {
    @observable errorMessage = "";
    @observable mobileValidationError = false;
    @observable displayMobileDeleteWarning = false;
    @observable displayMobileValidationError = false;

    @observable oldMobile = "";

    componentDidMount() {
        this.oldMobile = this.props.kontaktinfoStore.current.mobile;
    }

    @autobind
    handleSubmit() {
        if(this.mobileValidationError){
            this.displayMobileValidationError=true
        } else {
            this.props.history.push('/kontaktinfo');
        }
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

        if(this.oldMobile != current.mobile && current.mobile.length === 0
            || this.oldMobile != current.mobileConfirmed && current.mobileConfirmed.length === 0){
            this.errorMessage = "error.mobileError"
            this.displayMobileDeleteWarning = true;
        }

        if(current.mobile.length){
            if(!current.mobile.replace(/\s+/g, '').match("^([+][0-9]{2})?[0-9]{8}$")){
                this.errorMessage = "error.mobileError"
                this.mobileValidationError = true;
                return;
            }
        }

        this.errorMessage = "error.mobileRepeatError"
        this.mobileValidationError = !(current.mobileConfirmed === current.mobile);
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title="title" sub_title="page_title.edit_mobile"/>

                { this.displayMobileValidationError && <ContentInfoBox content={this.errorMessage} state="error"  /> }
                { this.displayMobileDeleteWarning ? <ContentInfoBox content="info.sletteMobilVarsel"  /> : null }

                <DigdirForm
                    id="editMobilnr"
                    onSubmitCallback={this.handleSubmit}>

                    <SynchedInput
                        tabIndex="1"
                        error={this.displayMobileValidationError}
                        id="idporten.input.CONTACTINFO_MOBILE"
                        name="idporten.input.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobile"
                        textKey="field.mobile"
                        onChangeCallback={this.validateMobileRepeated}/>

                    <SynchedInput
                        tabIndex="2"
                        error={this.displayMobileValidationError}
                        id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobileConfirmed"
                        textKey="field.mobileConfirmed"
                        onChangeCallback={this.validateMobileRepeated}/>

                    <DigdirButtons>
                        <DigdirButton
                            tabIndex="3"
                            id="idporten.inputbutton.SAVE"
                            name="idporten.inputbutton.SAVE"
                            type="submit"
                            value="submit"
                            textKey="button.save" />

                        <DigdirButton
                            tabIndex="4"
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

export default EditMobile;
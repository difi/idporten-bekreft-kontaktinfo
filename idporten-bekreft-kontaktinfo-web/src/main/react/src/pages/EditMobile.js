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
import Validator from "../components/Validator";

@inject("kontaktinfoStore")
@observer
class EditMobile extends Component {
    @observable errorMessage = null;
    @observable warning = null;

    @autobind
    handleSubmit() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        this.errorMessage = Validator.validateMobile(current)

        if(this.warning){
            this.warning=null;
        } else if(!this.errorMessage) {
            this.warning = Validator.isMobileRemoved(current)
        }

        console.log(this.errorMessage)
        console.log(this.warning)
        if(!this.errorMessage && !this.warning){
            this.props.kontaktinfoStore.current.history.mobile = current.mobile;
            this.props.history.push('/kontaktinfo');
        }
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
                <ContentHeader title="title" sub_title="page_title.edit_mobile"/>

                { this.errorMessage && <ContentInfoBox content={this.errorMessage} state="error"  /> }
                { this.warning && <ContentInfoBox content={this.warning}  /> }

                <DigdirForm
                    id="editMobilnr"
                    onSubmitCallback={this.handleSubmit}>

                    <SynchedInput
                        tabIndex="1"
                        error={this.errorMessage != null}
                        id="idporten.input.CONTACTINFO_MOBILE"
                        name="idporten.input.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobile"
                        textKey="field.mobile"
                        />

                    <SynchedInput
                        tabIndex="2"
                        error={this.errorMessage != null}
                        id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobileConfirmed"
                        textKey="field.mobileConfirmed"
                        />

                    <DigdirButtons>
                        <DigdirButton
                            tabIndex="3"
                            id="idporten.inputbutton.SAVE"
                            name="idporten.inputbutton.SAVE"
                            type="submit"
                            value="submit"
                            textKey={ this.warning ? "button.confirm" : "button.save"}
                        />

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
import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import autobind from "autobind-decorator";
import DigdirButtons from "../common/DigdirButtons";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import SynchedInput from "../common/SynchedInput";
import {observable} from "mobx";
import ContentHeader from "../common/ContentHeader";
import ContentInfoBox from "../common/ContentInfoBox";
import Validator from "../components/Validator";
import PageWrapper from "../common/Page";

@inject("kontaktinfoStore")
@observer
class EditMobile extends Component {
    @observable errorMessage = null;
    @observable warning = null;

    @autobind
    handleSubmit() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        this.checkForWarnings(current);

        Validator.validateMobile(current).then(response => {
            this.errorMessage = response;

            if(!this.errorMessage && !this.warning){
                this.props.kontaktinfoStore.current.history.mobile = current.mobile;
                this.props.history.push('/kontaktinfo');
            }
        });
    }

    checkForWarnings(current){
        if(this.warning){
            this.warning = null;
        } else {
            this.warning = Validator.isMobileRemoved(current);
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
                <ContentHeader page_title="page_title.edit_mobile"/>

                <PageWrapper>
                    { this.errorMessage && <ContentInfoBox content={this.errorMessage} state="error"  /> }
                    { this.warning && <ContentInfoBox content={this.warning}  /> }

                    <DigdirForm
                        id="editMobilnr"
                        onSubmitCallback={this.handleSubmit}>

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
                                id="idporten.inputbutton.SAVE"
                                name="idporten.inputbutton.SAVE"
                                type="submit"
                                value="submit"
                                textKey={ this.warning ? "button.confirm" : "button.save"}
                            />

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

export default EditMobile;
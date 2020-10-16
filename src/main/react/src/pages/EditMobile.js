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
    @observable error = null;
    @observable warning = null;
    @observable oldMobile = "";

    componentDidMount() {
        this.oldMobile = this.props.kontaktinfoStore.current.mobile;
    }

    @autobind
    handleSubmit() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        this.error = Validator.validateMobile(current.mobile,current.mobileConfirmed)


        if(!this.error){
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
    checkForWarnings(){
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        this.warning = Validator.isMobileRemoved(current.mobile, current.mobileConfirmed, this.oldMobile)
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title="title" sub_title="page_title.edit_mobile"/>

                { this.error && <ContentInfoBox content={this.error} state="error"  /> }
                { this.warning && <ContentInfoBox content={this.warning}  /> }

                <DigdirForm
                    id="editMobilnr"
                    onSubmitCallback={this.handleSubmit}>

                    <SynchedInput
                        tabIndex="1"
                        error={this.error}
                        id="idporten.input.CONTACTINFO_MOBILE"
                        name="idporten.input.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobile"
                        textKey="field.mobile"
                        onChangeCallback={this.checkForWarnings}
                        />

                    <SynchedInput
                        tabIndex="2"
                        error={this.error}
                        id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobileConfirmed"
                        textKey="field.mobileConfirmed"
                        onChangeCallback={this.checkForWarnings}
                        />

                    <DigdirButtons>
                        <DigdirButton
                            tabIndex="3"
                            id="idporten.inputbutton.SAVE"
                            name="idporten.inputbutton.SAVE"
                            type="submit"
                            value="submit"
                            textKey="button.save"
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
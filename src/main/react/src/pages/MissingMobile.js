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
class MissingMobile extends Component {
    @observable error = null;

    @autobind
    handleCommit() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        this.error = Validator.validateMobile(current)

        if(!this.error){
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

                { this.error && <ContentInfoBox content={this.error} state="error"  /> }

                <ContentInfoBox content="info.manglendeMobilVarsel"  />
                <ContentInfo content="info.manglendeMobilLabel" />

                <DigdirForm id="editMobilnr" onSubmitCallback={this.handleCommit}>
                    <SynchedInput
                        tabIndex="1"
                        error={this.error}
                        id="idporten.input.CONTACTINFO_MOBILE"
                        name="idporten.input.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobile"
                        textKey="field.mobile"
                        />
                        
                    <SynchedInput
                        tabIndex="2"
                        error={this.error}
                        id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                        source={current}
                        path="mobileConfirmed"
                        textKey="field.mobileConfirmed"
                        />

                    <DigdirButtons>
                        <DigdirButton
                            tabIndex="3"
                            onClick={this.handleSubmit}
                            type="submit"
                            value="submit"
                            textKey="button.next"
                            id="idporten.inputbutton.NEXT"
                            name="idporten.inputbutton.NEXT"/>

                        <DigdirButton
                            tabIndex="4"
                            type="submit"
                            value="skip"
                            data-white="true"
                            onClick={this.handleCancel}
                            textKey="button.skip"
                            id="idporten.inputbutton.SKIP"
                            name="idporten.inputbutton.SKIP"/>
                    </DigdirButtons>
                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default MissingMobile;
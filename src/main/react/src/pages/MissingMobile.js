import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

import autobind from "autobind-decorator";
import DigdirButtons from "../common/DigdirButtons";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import ContentInfoBox from "../common/ContentInfoBox";
import {withStyles} from "@material-ui/core";
import {withTranslation} from "react-i18next";
import kontaktinfoStore from "../stores/KontaktinfoStore";
import SynchedInput from "../common/SynchedInput";
import {observable} from "mobx";
import ContentHeader from "../common/ContentHeader";
import ContentInfo from "../common/ContentInfo";

const styles = (theme) => ({
    root: {

    },
    codeButton: {
        backgroundColor: "#006cff",
        '&:hover': {
            borderColor: "#9fa9b4",
            backgroundColor: "#134f9e",
        },
    }
});

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

        if(this.props.kontaktinfoStore.gotoUrl === "" || this.props.kontaktinfoStore.gotoUrl == null) {
            let gotoParam = new URLSearchParams(this.props.location.search).getAll("goto");
            //console.log("new goto: " + gotoParam);
            this.props.kontaktinfoStore.setGotoUrl(gotoParam);
        }else{
            //console.log("current goto: " + this.props.kontaktinfoStore.gotoUrl);
        }

        if (this.props.kontaktinfoStore.code === "" || this.props.kontaktinfoStore.code == null) {
            const personIdentifikator = new URLSearchParams(this.props.location.search).get("fnr");
            //console.log("new fnr: " + personIdentifikator);
            this.props.kontaktinfoStore.setCode(personIdentifikator);
        }else{
            //console.log("current fnr: " + this.props.kontaktinfoStore.code);
        }

    }

    @autobind
    handleCommit() {
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    handleCancel() {
        this.props.kontaktinfoStore.current.mobile = this.oldMobile;
        this.props.kontaktinfoStore.current.mobileConfirmed = this.oldMobile;
        //this.props.history.push('/kontaktinfo');

        let gotoParam = new URLSearchParams(this.props.location.search).getAll("goto");
        const personIdentifikator = new URLSearchParams(this.props.location.search).get("fnr");

        this.props.history.push({
            pathname: '/kontaktinfo'
            //search: "?goto=" + encodeURIComponent(gotoParam.toString()) + "&fnr=" + personIdentifikator,
        });


    }

    @autobind
    validateMobileRepeated() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        this.confirmDisabled = !(current.mobile.length > 0 && current.mobileConfirmed === current.mobile);
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
                    <SynchedInput id="mobile"
                                  source={current}
                                  path="mobile"
                                  textKey="field.mobile"
                                  onChangeCallback={this.validateMobileRepeated}/>
                    <SynchedInput id="mobileConfirmed"
                                  source={current}
                                  path="mobileConfirmed"
                                  textKey="field.mobileConfirmed"
                                  onChangeCallback={this.validateMobileRepeated}/>
                    <DigdirButtons>
                        <DigdirButton disabled={this.confirmDisabled} type="submit"
                                      value="submit"
                                      textKey="button.confirm" />
                        <DigdirButton type="submit"
                                      value="skip"
                                      data-white="true"
                                      onClick={this.handleCancel}
                                      textKey="button.skip" />
                    </DigdirButtons>
                </DigdirForm>
            </React.Fragment>
        );
    }
}

export default MissingMobile;
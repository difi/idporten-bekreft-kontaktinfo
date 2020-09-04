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
import DigdirIconButton from "../common/DigdirIconButton";
import {observable} from "mobx";

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
class EditMobilnr extends Component {
    @observable confirmDisabled = true;

    componentDidMount() {
        console.log("Edit email");
    }

    @autobind
    handleCommit(e) {
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    validateMobileRepeated(e) {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        // if (!(current.mobilnr.match("^\\+?[0-9]+$"))) {
        //     this.confirmDisabled = true;
        //     return;
        // }
        console.log(current.mobilnr + "-" + current.mobilnrBekreftet);
        console.log("mobil teller: " + current.teller);
        this.confirmDisabled = !(current.mobilnr.length > 0 && current.mobilnrBekreftet === current.mobilnr);
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        console.log("edit mobilnr - før render");
        return (
            <div>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="editMobilnr" onSubmitCallback={this.handleCommit}>
                    <SynchedInput id="mobilnr"
                                  source={current}
                                  path="mobilnr"
                                  textKey="field.mobile"
                                  onChangeCallback={this.validateMobileRepeated}/>
                    <SynchedInput id="mobilnrBekreftet"
                                  source={current}
                                  path="mobilnrBekreftet"
                                  textKey="field.mobilerepeat"
                                  onChangeCallback={this.validateMobileRepeated}/>
                    <DigdirButtons>
                        <DigdirButton disabled={this.confirmDisabled} type="submit"
                                      value="submit"
                                      textKey="button.confirm" />
                        {/*<DigdirButton textKey="button.confirm" form="bekreftKontaktinfo" type="submit" />*/}
                    </DigdirButtons>
                </DigdirForm>
            </div>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(EditMobilnr);
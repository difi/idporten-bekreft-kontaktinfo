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
class EditEpost extends Component {
    @observable confirmDisabled = true;

    componentDidMount() {
        console.log("Edit email");
        const {kontaktinfoStore} = this.props;
    }

    @autobind
    handleCommit(e) {
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    validateEmailRepeated(e) {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        if (!(current.epost.match(".*@.*"))) {
            this.confirmDisabled = true;
            return;
        }
        console.log("epost teller: " + current.teller);
        this.confirmDisabled = !(current.epost.length > 0 && current.epostBekreftet === current.epost);
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        console.log("edit EPOST - før render ");
        return (
            <div>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="bekreftKontaktinfo" onSubmitCallback={this.handleCommit}>
                    <SynchedInput id="epost"
                                  source={current}
                                  path="epost"
                                  textKey="field.email"
                                  onChangeCallback={this.validateEmailRepeated}/>
                    <SynchedInput id="epostBekreftet"
                                  source={current}
                                  path="epostBekreftet"
                                  textKey="field.emailrepeat"
                                  onChangeCallback={this.validateEmailRepeated}/>
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
export default compose(withStyles(styles), withTranslation())(EditEpost);
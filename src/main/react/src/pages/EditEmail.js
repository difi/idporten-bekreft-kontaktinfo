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
class EditEmail extends Component {
    @observable confirmDisabled = false;
    @observable oldEmail = "";

    componentDidMount() {
        this.oldEmail = this.props.kontaktinfoStore.current.email;
        console.log("oldEmail: " + this.oldEmail);
    }

    @autobind
    handleCommit() {
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    handleCancel() {
        console.log("Handle cancel " + this.oldEmail);
        this.props.kontaktinfoStore.current.email = this.oldEmail;
        this.props.kontaktinfoStore.current.emailConfirmed = this.oldEmail;
        this.props.history.push('/kontaktinfo');
    }

    @autobind
    validateEmailRepeated() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;
        if (!(current.email.match(".*@.*"))) {
            this.confirmDisabled = true;
            return;
        }
        this.confirmDisabled = !(current.email.length > 0 && current.emailConfirmed === current.email);
    }

    render() {
        const current = this.props.kontaktinfoStore.current;

        return (
            <div>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="confirmContactinfo"
                            onSubmitCallback={this.handleCommit}>
                    <SynchedInput id="email"
                                  source={current}
                                  path="email"
                                  textKey="field.email"
                                  onChangeCallback={this.validateEmailRepeated}/>
                    <SynchedInput id="epostBekreftet"
                                  source={current}
                                  path="emailConfirmed"
                                  textKey="field.emailrepeat"
                                  onChangeCallback={this.validateEmailRepeated}/>
                    <DigdirButtons>
                        <DigdirButton disabled={this.confirmDisabled} type="submit"
                                      value="submit"
                                      textKey="button.confirm" />
                        <DigdirButton type="submit"
                                      value="cancel"
                                      data-white="true"
                                      onClick={this.handleCancel}
                                      textKey="button.cancel" />
                    </DigdirButtons>
                </DigdirForm>
            </div>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(EditEmail);
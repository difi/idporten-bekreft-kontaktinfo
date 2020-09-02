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

    componentDidMount() {
        console.log("Edit email");
    }

    @autobind
    handleSubmit(e) {
        const {kontaktinfoStore} = this.props;
        console.log("handlesubmit edit Email: " + e);
        window.location = this.props.kontaktinfoStore.gotoUrl;
    }

    @autobind
    handleCommit(e) {
        this.props.history.push({
            pathname: '/kontaktinfo',
            state: {previousScreen: 3}
        });
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        console.log("edit mobilnr - før render");
        return (
            <div>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="editMobilnr" onSubmitCallback={this.handleCommit}>
                    <SynchedInput disabled={true} id="mobilnr" source={current.mobilnr} path="mobilnr" textKey="field.mobilnr" />
                    <SynchedInput disabled={true} id="mobilnrBekreftet" source={current.mobilnrBekreftet} path="mobilnrBekreftet" textKey="field.mobilnrBekreftet" />
                    <DigdirButtons>
                        <DigdirButton textKey="button.confirm" />
                        {/*<DigdirButton textKey="button.confirm" form="bekreftKontaktinfo" type="submit" />*/}
                    </DigdirButtons>
                </DigdirForm>
            </div>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(EditMobilnr);
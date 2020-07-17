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
class ConfirmKontaktinfo extends Component {

    componentDidMount() {
        const {kontaktinfoStore} = this.props;

        const gotoParam = new URLSearchParams(this.props.location.search).get("goto");
        const code = new URLSearchParams(this.props.location.search).get("code");
        kontaktinfoStore.setGotoUrl(gotoParam);
        kontaktinfoStore.setCode(code);
        kontaktinfoStore.fetchKontaktinfo(code);
    }

    @autobind
    handleSubmit(e) {
        const {kontaktinfoStore} = this.props;
        console.log("handlesubmit1: " + e);
        window.location = this.props.kontaktinfoStore.gotoUrl;
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        console.log("url: " + this.gotoUrl);
        return (
            <div>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="bekreftKontaktinfo" onSubmitCallback={this.handleSubmit}>
                    <SynchedInput disabled={true} id="email" source={current.email} path="email" textKey="field.email" />
                    <SynchedInput disabled={true} id="mobile" source={current.mobile} path="mobile" textKey="field.mobile" />
                    <DigdirButtons>
                        <DigdirButton textKey="button.confirm" component="a" href={kontaktinfoStore.gotoUrl} />
                        {/*<DigdirButton textKey="button.confirm" form="bekreftKontaktinfo" type="submit" />*/}
                    </DigdirButtons>
                </DigdirForm>
            </div>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ConfirmKontaktinfo);


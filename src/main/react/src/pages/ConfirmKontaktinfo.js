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
        const gotoParam = new URLSearchParams(this.props.location.search).get("goto");
        const code = new URLSearchParams(this.props.location.search).get("code");
        this.props.kontaktinfoStore.setGotoUrl(gotoParam);
        this.props.kontaktinfoStore.setCode(code);
    }

    @autobind
    handleSubmit(e) {
        const {kontaktinfoStore} = this.props;
        console.log("handlesubmit1: " + e);
        window.location = this.props.kontaktinfoStore.gotoUrl;
    }

    render() {
        const {kontaktinfoStore} = this.props;
        console.log("url: " + this.gotoUrl);
        return (
            <div>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="bekreftKontaktinfo" onSubmitCallback={this.handleSubmit}>
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


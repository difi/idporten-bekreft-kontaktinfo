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
import { Edit } from '@material-ui/icons';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";

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
        console.log("Getting anywhere 15:29");
        const {kontaktinfoStore} = this.props;

        //const gotoParam = new URLSearchParams(this.props.location.search).get("goto");
        const gotoParam = new URLSearchParams(this.props.location.search).getAll("goto");
        const code = new URLSearchParams(this.props.location.search).get("fnr");
        kontaktinfoStore.setGotoUrl(gotoParam); //"https://eid-atest-web01.dmz.local:443/opensso/UI/Login?realm=norge.no&ForceAuth=&gx_charset=UTF-8&locale=nb&service=KontaktInfo");
        kontaktinfoStore.setCode(code);
        //Her skal vi kalle idporten
        kontaktinfoStore.fetchKontaktinfo(code);
    }

    @autobind
    handleEditEpost(e) {
        this.props.history.push({
            pathname: '/editEpost',
            state: {previousScreen: '/kontaktinfo'}
        });
    }

    @autobind
    handleEditMobilnr(e) {
        this.props.history.push({
            pathname: '/editMobilnr',
            state: {previousScreen: '/kontaktinfo'}
        });
    }

    @autobind
    handleSubmit(e) {
        const {kontaktinfoStore} = this.props;
        console.log("handlesubmit1: " + e);
        //window.location = this.props.kontaktinfoStore.gotoUrl;
    }

    render() {
        let {kontaktinfoStore} = this.props;
        let current = kontaktinfoStore.current;
        const isLoading = kontaktinfoStore.isLoading;

        return (
            <div>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="bekreftKontaktinfo"
                            action={kontaktinfoStore.gotoUrl}
                            method="post"
                            onSubmitCallback={this.handleSubmit}>
                    <SynchedInput
                        disabled={true}
                        id="email"
                        source={current}
                        value={current.epost}
                        path="epost"
                        textKey="field.email"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={e => {this.handleEditEpost(e)}}><Edit/></IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <SynchedInput
                        disabled={true}
                        id="mobilnr"
                        source={current}
                        value={current.mobilnr}
                        path="mobilnr"
                        textKey="field.mobile"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={e => {this.handleEditMobilnr(e)}}><Edit/></IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                </DigdirForm>

                <form id="postForm" method="post" action={kontaktinfoStore.gotoUrl}>
                    <DigdirButtons>
                    <DigdirButton id="postFormButton" name="saveform" form="postForm" type="submit" textKey="button.confirm" />
                    </DigdirButtons>
                </form>

            </div>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ConfirmKontaktinfo);


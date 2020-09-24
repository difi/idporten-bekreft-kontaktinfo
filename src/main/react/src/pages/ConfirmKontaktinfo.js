import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

import autobind from "autobind-decorator";
import DigdirButtons from "../common/DigdirButtons";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import ContentInfoBox from "../common/ContentInfoBox";
import kontaktinfoStore from "../stores/KontaktinfoStore";
import SynchedInput from "../common/SynchedInput";
import {Edit} from '@material-ui/icons';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ContentHeader from "../common/ContentHeader";

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

    getTitle() {
        return "Kontaktinformasjon";
    }

    componentDidMount() {

        const {kontaktinfoStore} = this.props;

        if(this.props.kontaktinfoStore.gotoUrl === "" || this.props.kontaktinfoStore.gotoUrl == null) {
            let gotoParam = new URLSearchParams(this.props.location.search).getAll("goto");
            //console.log("new goto: " + gotoParam);
            kontaktinfoStore.setGotoUrl(gotoParam);
        }else{
            //console.log("current goto: " + this.props.kontaktinfoStore.gotoUrl);
        }

        if (this.props.kontaktinfoStore.code === "" || this.props.kontaktinfoStore.code == null) {
            const personIdentifikator = new URLSearchParams(this.props.location.search).get("fnr");
            //console.log("new fnr: " + personIdentifikator);
            kontaktinfoStore.setCode(personIdentifikator);
        }else{
            //console.log("current fnr: " + this.props.kontaktinfoStore.code);
        }


        //Her skal vi kalle idporten
        if (!kontaktinfoStore.current.fnr && this.props.kontaktinfoStore.code) {
            //console.log("fetch kontaktinfo for: " + this.props.kontaktinfoStore.code);
            kontaktinfoStore.fetchKontaktinfo(this.props.kontaktinfoStore.code);
        }else{
            //console.log("not fetching kontaktinfo, fnr:" + kontaktinfoStore.current.fnr + " code: " + this.props.kontaktinfoStore.code);
        }

    }

    @autobind
    handleEditEmail(e) {
        this.props.history.push({
            pathname: '/editEmail',
            state: {previousScreen: '/kontaktinfo'}
        });
    }

    @autobind
    handleEditMobile(e) {
        this.props.history.push({
            pathname: '/editMobile',
            state: {previousScreen: '/kontaktinfo'}
        });
    }

    @autobind
    handleSubmit(e) {
        this.props.kontaktinfoStore.getKontaktinfoForGotoUrl();
        this.props.kontaktinfoStore.updateKontaktinfo();
    }

    render() {
        let {kontaktinfoStore} = this.props;
        let current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader title={this.getTitle()}/>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="bekreftKontaktinfo"
                            action={kontaktinfoStore.gotoUrl}
                            method="post">
                    <SynchedInput disabled={true} id="email" source={current} value={current.email}
                        path="email" textKey="field.email" InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="Endre e-post" onClick={e => {this.handleEditEmail(e)}}><Edit/></IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <SynchedInput disabled={true} id="mobile" source={current} value={current.mobile}
                        path="mobile" textKey="field.mobile" InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="Endre mobil" onClick={e => {this.handleEditMobile(e)}}><Edit/></IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DigdirForm>

                <form id="postForm" method="post" action={this.props.kontaktinfoStore.gotoUrl} onSubmit={this.handleSubmit}>
                    <DigdirButtons>
                        <DigdirButton id="postFormButton" name="saveform" form="postForm" type="submit" textKey="button.confirm"/>
                    </DigdirButtons>
                </form>
            </React.Fragment>
        );
    }
}

export default ConfirmKontaktinfo;


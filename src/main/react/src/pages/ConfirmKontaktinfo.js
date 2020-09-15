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
        console.log("Getting anywhere 10:12");
        const {kontaktinfoStore} = this.props;

        //const gotoParam = new URLSearchParams(this.props.location.search).get("goto");
        const gotoParam = new URLSearchParams(this.props.location.search).getAll("goto");
        const personIdentifikator = new URLSearchParams(this.props.location.search).get("fnr");
        if (gotoParam && gotoParam.length > 0) {
            kontaktinfoStore.setGotoUrl(gotoParam); //"https://eid-atest-web01.dmz.local:443/opensso/UI/Login?realm=norge.no&ForceAuth=&gx_charset=UTF-8&locale=nb&service=KontaktInfo");
        }
        if (personIdentifikator) {
            kontaktinfoStore.setCode(personIdentifikator);
        }
        //Her skal vi kalle idporten
        if (!kontaktinfoStore.current.fnr) {
            kontaktinfoStore.fetchKontaktinfo(personIdentifikator);
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
        this.props.kontaktinfoStore.updateKontaktinfo()
    }

    render() {
        let current = this.props.kontaktinfoStore.current;

        return (
            <div>
                <ContentHeader title={this.getTitle()}/>
                <ContentInfoBox textKey="info.kontaktinfo"  />
                <DigdirForm id="bekreftKontaktinfo"
                            action={kontaktinfoStore.gotoUrl}
                            method="post">
                    <SynchedInput
                        disabled={true}
                        id="email"
                        source={current}
                        value={current.email}
                        path="email"
                        textKey="field.email"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={e => {this.handleEditEmail(e)}}><Edit/></IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <SynchedInput
                        disabled={true}
                        id="mobile"
                        source={current}
                        value={current.mobile}
                        path="mobile"
                        textKey="field.mobile"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={e => {this.handleEditMobile(e)}}><Edit/></IconButton>
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
            </div>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ConfirmKontaktinfo);


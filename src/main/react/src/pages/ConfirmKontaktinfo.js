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

@inject("kontaktinfoStore")
@observer
class ConfirmKontaktinfo extends Component {

    getTitle() {
        return "Kontaktinformasjon";
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
                <DigdirForm
                    id="bekreftKontaktinfo"
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
                                    <IconButton
                                        tabindex="2"
                                        aria-label="Endre e-post"
                                        id="idporten.inputbutton.CHANGE_EMAIL"
                                        name="idporten.inputbutton.CHANGE_EMAIL"
                                        onClick={e => {this.handleEditEmail(e)}}><Edit/>
                                    </IconButton>
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
                                    <IconButton
                                        tabindex="3"
                                        aria-label="Endre mobil"
                                        id="idporten.inputbutton.CHANGE_MOBILE"
                                        name="idporten.inputbutton.CHANGE_MOBILE"
                                        onClick={e => {this.handleEditMobile(e)}}><Edit/>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DigdirForm>

                <DigdirForm id="postForm" method="post" action={this.props.kontaktinfoStore.gotoUrl} onSubmit={this.handleSubmit}>
                    <DigdirButtons>
                        <DigdirButton
                            tabindex="4"
                            id="idporten.inputbutton.CONTINUE_CONFIRM"
                            name="idporten.inputbutton.CONTINUE_CONFIRM"
                            form="postForm"
                            type="submit"
                            textKey="button.confirm"
                        />
                    </DigdirButtons>
                </DigdirForm>

            </React.Fragment>
        );
    }
}

export default ConfirmKontaktinfo;


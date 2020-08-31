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
        console.log("Getting anywhere");
        const {kontaktinfoStore} = this.props;

        //const gotoParam = new URLSearchParams(this.props.location.search).get("goto");
        const gotoParam = new URLSearchParams(this.props.location.search).getAll("goto");
        const code = new URLSearchParams(this.props.location.search).get("fnr");
        //kontaktinfoStore.setGotoUrl(gotoParam2.toString());
        kontaktinfoStore.setGotoUrl(gotoParam); //"https://eid-atest-web01.dmz.local:443/opensso/UI/Login?realm=norge.no&ForceAuth=&gx_charset=UTF-8&locale=nb&service=KontaktInfo");
        kontaktinfoStore.setCode(code);
        //Her skal vi kalle idporten
        kontaktinfoStore.fetchKontaktinfo(code);
        console.log(kontaktinfoStore.current);
        console.log("gotoParam:" + gotoParam);
        //console.log("gotoParam2:" + gotoParam2.toString());
        //console.log("gotoParam2_array:" + gotoParam2);
        console.log("getgotourl:" + kontaktinfoStore.gotoUrl);

    }

    @autobind
    handleSubmit(e) {
        const {kontaktinfoStore} = this.props;
        console.log("handlesubmit1: " + e);
        //window.location = this.props.kontaktinfoStore.gotoUrl;
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <div>
                <ContentInfoBox textKey="info.kontaktinfo"  />

                <DigdirForm id="bekreftKontaktinfo" action={kontaktinfoStore.gotoUrl} >
                    <SynchedInput
                        disabled={true}
                        id="email"
                        source={current.epost}
                        path="epost"
                        textKey="field.epost"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={e => {console.log("You clicked edit! :)")}}><Edit/></IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <SynchedInput disabled={true} id="mobile" source={current.mobilnr} path="mobilnr" textKey="field.mobilnr" />
                    {/*<DigdirIconButton>onClick={this.handleEditMobilnr()}</DigdirIconButton>*/}
                    <DigdirButtons>
                        <DigdirButton textKey="button.confirm" form="bekreftKontaktinfo" type="submit" />
                    </DigdirButtons>
                </DigdirForm>

                <form id="postForm" method="post" action={kontaktinfoStore.gotoUrl}>
                    <DigdirButton id="postFormButton" name="saveform" form="postForm" type="submit" text={"Post form"} />
                </form>

            </div>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ConfirmKontaktinfo);


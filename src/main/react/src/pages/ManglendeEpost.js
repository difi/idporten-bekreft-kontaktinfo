import React, {Component} from 'react';
// import ConsentCard from "../components/ConsentCard";
import {inject, observer} from "mobx-react";

import autobind from "autobind-decorator";
// import consentStore from "../stores/ConsentStore";
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import DigdirButtons from "../common/DigdirButtons";
import ContentInfoBox from "../common/ContentInfoBox";
import ContentBox from "../common/ContentBox";
import SynchedInput from "../common/SynchedInput";

// import ErrorBox from "../components/ErrorBox";

@inject("kontaktinfoStore")
@observer
class ManglendeEpost extends Component {

    // componentWillMount() {
    //     this.props.kontaktinfoStore.getKontaktinfo();
    // }

    @autobind
    compareMobile(e) {
        const email = this.props.kontaktinfoStore.current.email;
        const emailrepeat = this.props.kontaktinfoStore.current.emailrepeat;
        this.nextDisabled = !(email.length > 0 && email === emailrepeat);
    }

    render() {
        const {t, kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <div>
                <ContentInfoBox textKey="info.manglendeEpostVarsel"  />
                <ContentBox textKey="info.manglendeEpostLabel"  />
                <DigdirForm id="registrerEpost" >
                    <SynchedInput id="email" source={current.email} path="email" required textKey="field.email" autoFocus={true} onChangeCallback={this.compareMobile()} />
                    <SynchedInput id="emailRepeat" source={current.emailrepeat} path="emailrepeat" required textKey="field.emailrepeat" autoFocus={true} onChangeCallback={this.compareMobile()} />
                    <DigdirButtons>
                        <DigdirButton textKey="button.skip"  />
                        <DigdirButton disabled={this.nextDisabled} textKey="button.next" component="a" href={kontaktinfoStore.gotoUrl} />
                    </DigdirButtons>
                </DigdirForm>
            </div>
        );
    }
}

export default ManglendeEpost;


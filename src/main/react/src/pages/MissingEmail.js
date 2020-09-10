import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

import autobind from "autobind-decorator";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import DigdirButtons from "../common/DigdirButtons";
import ContentInfoBox from "../common/ContentInfoBox";
import SynchedInput from "../common/SynchedInput";


@inject("kontaktinfoStore")
@observer
class MissingEmail extends Component {

    @autobind
    compareMobile(e) {
        const email = this.props.kontaktinfoStore.current.email;
        const emailrepeat = this.props.kontaktinfoStore.current.emailrepeat;
        this.nextDisabled = !(email.length > 0 && email === emailrepeat);
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <div>
                <ContentInfoBox textKey="info.manglendeEpostVarsel"  />
                {/*<ContentBox textKey="info.manglendeEpostLabel"  />*/}
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

export default MissingEmail;


import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import autobind from "autobind-decorator";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import DigdirButtons from "../common/DigdirButtons";
import SynchedInput from "../common/SynchedInput";
import ContentHeader from "../common/ContentHeader";
import ContentInfoBox from "../common/ContentInfoBox";
import {observable} from "mobx";
import Validator from "../components/Validator";
import PageWrapper from "../components/Page";

@inject("kontaktinfoStore")
@observer
class Create extends Component {
    @observable errorMessage = null;

    @autobind
    handleSubmit(e) {
        e.preventDefault();

        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        Validator.validateEmailAndMobile(current)
            .then(() => {
                if(current.isKontaktinfoUpdated){
                    this.props.kontaktinfoStore.updateKontaktinfo().then(() => {
                        document.getElementById('confirmContactinfo').submit()
                    }).catch((error) => {
                        this.setState(() => { throw error; });
                    });
                } else {
                    document.getElementById('confirmContactinfo').submit()
                }
            })
            .catch(error => {
                this.errorMessage = error
            })
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader page_title="page_title.create"/>
                <PageWrapper>
                    { this.errorMessage && <ContentInfoBox content={this.errorMessage} state="error"  /> }

                    <ContentInfoBox content="info.manglendeInformasjon"  />

                    <DigdirForm id="confirmContactinfo"
                                method="post" action={this.props.kontaktinfoStore.gotoUrl} onSubmit={this.handleSubmit}>

                        <SynchedInput
                            id="idporten.input.CONTACTINFO_EMAIL"
                            name="idporten.input.CONTACTINFO_EMAIL"
                            source={current}
                            path="email"
                            textKey="field.email"
                            error={this.errorEmail != null}/>

                        <SynchedInput
                            id="idporten.inputrepeat.CONTACTINFO_EMAIL"
                            name="idporten.inputrepeat.CONTACTINFO_EMAIL"
                            source={current}
                            path="emailConfirmed"
                            textKey="field.emailConfirmed"
                            error={this.errorEmail != null}/>

                        <SynchedInput
                            id="idporten.input.CONTACTINFO_MOBILE"
                            name="idporten.input.CONTACTINFO_MOBILE"
                            source={current}
                            path="mobile"
                            textKey="field.mobile"
                            error={this.errorMobile != null}/>

                        <SynchedInput
                            id="idporten.inputrepeat.CONTACTINFO_MOBILE"
                            name="idporten.inputrepeat.CONTACTINFO_MOBILE"
                            source={current}
                            path="mobileConfirmed"
                            textKey="field.mobileConfirmed"
                            error={this.errorMobile != null}/>

                        <DigdirButtons>
                            <DigdirButton
                                tabIndex="80"
                                type="submit"
                                textKey="button.next"/>
                        </DigdirButtons>
                    </DigdirForm>
                </PageWrapper>
            </React.Fragment>
        );
    }
}

export default Create;
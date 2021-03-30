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
import PageWrapper from "../common/Page";

@inject("kontaktinfoStore")
@observer
class Create extends Component {
    @observable errorEmail = null;
    @observable errorMobile = null;

    @autobind
    handleSubmit(e) {
        e.preventDefault();

        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        Validator.validateEmail(current).then(result => {
            this.errorEmail = result;

            Validator.validateMobile(current).then(result => {
                this.errorMobile = result;

                if (!this.errorEmail && !this.errorMobile) {

                    if (current.mobile.length !== 0 || current.email.length !== 0) {
                        this.props.kontaktinfoStore.updateKontaktinfo().then(() => {
                            this.submit()
                        }).catch((error) => {
                            this.setState(() => { throw error; });
                        });
                    } else {
                        this.submit()
                    }

                }
            })
        })
    }
    
    submit(){
        this.props.kontaktinfoStore.updateGotoUrl().then(() => {
            // dont submit data to KRR if no data is provided
            document.getElementById('confirmContactinfo').submit()
        });
    }

    render() {
        const {kontaktinfoStore} = this.props;
        const current = kontaktinfoStore.current;

        return (
            <React.Fragment>
                <ContentHeader page_title="page_title.create"/>
                <PageWrapper>


                    { this.errorEmail && <ContentInfoBox content={this.errorEmail} state="error"  /> }
                    { this.errorMobile && <ContentInfoBox content={this.errorMobile} state="error"  /> }

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
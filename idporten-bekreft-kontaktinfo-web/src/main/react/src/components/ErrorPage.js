import React, {Component} from 'react';
import {withTranslation} from "react-i18next";
import ContentInfoBox from "../common/ContentInfoBox";
import ContentHeader from "../common/ContentHeader";
import DigdirButtons from "../common/DigdirButtons";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import {inject} from "mobx-react";
import autobind from "autobind-decorator";
import PageWrapper from "../common/Page";

@inject("kontaktinfoStore")
class ErrorPage extends Component {

    @autobind
    handleSubmit(e) {
        e.preventDefault();
        this.props.kontaktinfoStore.updateGotoUrl().then(() => {
            document.getElementById('postForm').submit();
        })
    }

    render () {
        return (
            <React.Fragment>
                <ContentHeader page_title="page_title.error"/>
                <PageWrapper>
                    {this.props.errorMessage === "no_session" &&
                        <DigdirForm>
                            <ContentInfoBox header="info.errorNoSessionHeader" content="info.errorNoSession" state="warning" />
                            <DigdirButtons>
                                <DigdirButton
                                    id="cancel-button"
                                    tabIndex="4"
                                    textKey="button.back"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href='http://digdir.no';
                                    }}
                                />
                            </DigdirButtons>
                        </DigdirForm>
                    }
                    {this.props.errorMessage !== "no_session" &&
                        <DigdirForm id="postForm" method="post" action={this.props.kontaktinfoStore.gotoUrl}
                                    onSubmit={this.handleSubmit}>
                            <ContentInfoBox content="info.errorpage" state="warning" />
                            <DigdirButtons>
                                <DigdirButton
                                    tabIndex="4"
                                    id="idporten.inputbutton.CONTINUE_CONFIRM"
                                    name="idporten.inputbutton.CONTINUE_CONFIRM"
                                    form="postForm"
                                    type="submit"
                                    textKey="button.continue"
                                />
                            </DigdirButtons>
                        </DigdirForm>
                    }
                </PageWrapper>
            </React.Fragment>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withTranslation())(ErrorPage);

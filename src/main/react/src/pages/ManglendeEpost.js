import React, {Component, Fragment} from 'react';
// import ConsentCard from "../components/ConsentCard";
import {inject, observer} from "mobx-react";
import {Link} from "react-router-dom";
import repeat from "lodash/repeat";

import autobind from "autobind-decorator";
// import consentStore from "../stores/ConsentStore";
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {isEmpty} from "lodash";
import DigdirButton from "../common/DigdirButton";
import DigdirForm from "../common/DigdirForm";
import DigdirButtons from "../common/DigdirButtons";
// import ErrorBox from "../components/ErrorBox";

@inject("kontaktinfoStore")
@observer
class ManglendeEpost extends Component {

    // componentWillMount() {
    //     this.props.kontaktinfoStore.getKontaktinfo();
    // }

    render() {
        const {kontaktinfoStore} = this.props;

        return (
            <main>
                <div className="site-container">
                    {!isEmpty(kontaktinfoStore.error)
                        ?
                        <div/>// <ErrorBox/>
                        :
                        <Fragment>
                            <div className="site-container-header">
                                <h1>Kontaktinformasjon</h1>
                            </div>

                            <div>
                                <fieldset>
                                    <div class={"notification with-Icon"}>
                                        <p>
                                            Du har ikke registert epostadresse.
                                        </p>
                                    </div>
                                    <p>
                                        Du bør benytte din private e-postadresse, for å sikre at ingen andre får tilgang til din personlige ID.
                                    </p>
                                    <div>
                                        <label>E-post:</label>
                                        <input autoFocus name="idporten.input.CONTAKTINFO_EMAIL" type="tel" id="idporten.input.CONTACTINFO_EMAIL"/>
                                    </div>
                                    <div>
                                        <label>E-post:</label>
                                        <input autoFocus name="idporten.input.CONTAKTINFO_EMAIL" type="tel" id="idporten.input.CONTACTINFO_EMAIL"/>
                                    </div>

                                </fieldset>
                            </div>

                        </Fragment>
                    }
                </div>
            </main>
        )}
}

export default ManglendeEpost;


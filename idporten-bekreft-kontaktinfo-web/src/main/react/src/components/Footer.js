import React, {Component} from 'react';
import {Trans, withTranslation} from "react-i18next";

class Footer extends Component {

    render () {
        return (
            <footer className="f-Main">
                <div className="f-Main_Content">
                    <div className="f-Main_Logo" aria-hidden="true"/>
                    <div className="f-Main_Info">
                        <a className="f-Main_Link"
                           href="https://eid-systest-web01.dmz.local/opensso/support.jsp?service=MinIDChain&amp;pageid=dc5">
                            <Trans i18nKey="misc.contact-form"/>
                        </a>
                        <a href="tel:+4780030300" className="f-Main_Link"><span><Trans i18nKey="misc.phone"/>: 800 30 300</span></a>
                        <a target="_blank" className="f-Main_Link" href="https://eid.difi.no/nb/id-porten">
                            <Trans i18nKey="misc.login-help"/>
                        </a>
                        <a target="_blank" className="f-Main_Link" href="https://eid.difi.no/nb/sikkerhet-og-personvern">
                            <Trans i18nKey="misc.security-and-privacy"/>
                        </a>
                        <p>
                            <Trans i18nKey="misc.provided-by"/>
                            <a target="_blank" id="difilink" href="http://www.digdir.no/"
                               className="f-Main_Link">Digitaliseringsdirektoratet</a>
                        </p>
                    </div>
                </div>
            </footer>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withTranslation())(Footer);

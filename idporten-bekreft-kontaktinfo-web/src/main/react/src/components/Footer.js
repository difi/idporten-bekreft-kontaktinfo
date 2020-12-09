import React, {Component} from 'react';
import {Trans, withTranslation} from "react-i18next";

class Footer extends Component {

    render () {

        const { t } = this.props;

        return (
            <footer className="f-Main">
                <div className="f-Main_Content">
                    <div className="f-Main_Logo" aria-hidden="true"/>
                    <div className="f-Main_Info">
                        <a tabIndex="101" className="f-Main_Link"
                           href={t('url.contact-form-url')}>
                            <Trans i18nKey="misc.contact-form"/>
                        </a>
                        <a tabIndex="102" href="tel:+4780030300" className="f-Main_Link"><span><Trans i18nKey="misc.phone"/>: 800 30 300</span></a>
                        <a tabIndex="103" target="_blank" className="f-Main_Link" href={t('url.login-help-url')}>
                            <Trans i18nKey="misc.login-help"/>
                        </a>
                        <a tabIndex="104" target="_blank" className="f-Main_Link" href={t('url.security-and-privacy-url')}>
                            <Trans i18nKey="misc.security-and-privacy"/>
                        </a>
                        <p>
                            <a tabIndex="105" target="_blank" id="difilink" href="http://www.digdir.no/"
                               className="f-Main_Link"><Trans i18nKey="misc.provided-by"/></a>
                        </p>
                    </div>
                </div>
            </footer>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withTranslation())(Footer);

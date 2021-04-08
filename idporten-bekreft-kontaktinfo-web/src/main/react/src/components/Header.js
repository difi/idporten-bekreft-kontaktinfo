import React, {Component} from 'react';
import {withTranslation,Trans} from "react-i18next";

class Header extends Component {

    render () {
        return (
            <header className="h-Main">
                <div className="h-Main_Content">
                    <a href="https://www.digdir.no/" className="h_Main_Content_Link" tabIndex="100">
                        <span className="fa fa-angle-left fa-lg" aria-hidden="true"></span>
                        <span><Trans i18nKey="button.back"/> </span>
                    </a>
                </div>
            </header>
        );
    }
}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withTranslation())(Header);

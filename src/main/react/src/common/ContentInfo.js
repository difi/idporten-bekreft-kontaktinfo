import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {withTranslation} from "react-i18next";

const styles = (theme) => ({
    root: {
        margin: "2em 2.2857em",
        position: "relative",
        fontSize: "14px",
    },
});

class ContentInfo extends Component {
    render() {
        const { classes, textKey, t } = this.props;
        const text = t(textKey);

        return (
            <p className={classes.root} dangerouslySetInnerHTML={{__html: `${text}`}} />
        );
    }
}
const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ContentInfo);
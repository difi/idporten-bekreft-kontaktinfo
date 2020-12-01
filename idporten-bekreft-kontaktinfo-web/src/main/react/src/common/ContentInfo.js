import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {withTranslation} from "react-i18next";

const styles = (theme) => ({
    root: {
        position: "relative",
        fontSize: "14px",
    },
});

class ContentInfo extends Component {
    render() {
        const { classes, content, t } = this.props;
        const t_content = t(content);

        return (
            <p className={classes.root} dangerouslySetInnerHTML={{__html: `${t_content}`}} />
        );
    }
}
const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ContentInfo);
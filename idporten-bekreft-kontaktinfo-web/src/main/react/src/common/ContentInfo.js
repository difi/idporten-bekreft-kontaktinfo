import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {withTranslation} from "react-i18next";

class ContentInfo extends Component {
    render() {
        const { classes, content, t } = this.props;
        const t_content = t(content);

        return (
            <p className={classes.root} dangerouslySetInnerHTML={{__html: `${t_content}`}} />
        );
    }
}

const styles = () => ({
    root: {
        position: "relative",
        fontSize: "14px",
    },
});

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ContentInfo);
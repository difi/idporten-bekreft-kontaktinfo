import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {observer} from "mobx-react";
import {withTranslation} from "react-i18next";
import digdirLogo from "../images/digdir-logo-cropped.png"

@observer
class ContentHeader extends Component {

    render() {
        const { classes, t, page_title } = this.props;
        const t_page_title = t(page_title);

        return (
            <React.Fragment>
                <div className={classes.sub} >
                    <h1 className={classes.h1} dangerouslySetInnerHTML={{__html: `<div> ${t_page_title} </div>`}}/>
                </div>
            </React.Fragment>

        );
    }
}

const styles = () => ({
    main: {
        padding: "1rem",
        borderBottom: "1px solid #e6ebf0",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "white",
    },
    sub: {
        padding: "0 1rem 0 1rem",
        borderBottom: "1px solid #e6ebf0",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#f7f8fa",
    },
    h1: {
        margin: "0",
        position: "relative",
        paddingLeft: "calc(.5em + 25px)",
        textTransform: "uppercase",
        fontSize: ".875em",
        lineHeight: "1.2em",
        color: "#222",
        fontWeight: "700",
        minHeight: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        '&::before': {
            content: '""',
            display: "block",
            position: "absolute",
            width: "22px",
            height: "22px",
            left: "0",
            bottom: "1.5em",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
            backgroundImage: `url(${digdirLogo})`,
        }
    },
    providerBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "#222",
        lineHeight: "1.5em",
        letterSpacing: ".1px",
        height: "32px"
    },
    providerImage: {
        height: "2em",
    },
});

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ContentHeader);
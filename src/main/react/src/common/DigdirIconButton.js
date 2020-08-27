import React, {Component} from "react";

import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {withTranslation} from "react-i18next";

const styles = (theme) => ({
    root: {
        flexGrow: "1",
        fontFamily: '"Open Sans", sans-serif',
        backgroundColor: "#006cff",
        color: "white",
        padding: "0 2rem",
        margin: "0 1rem 1rem 1rem",
        whiteSpace: "nowrap",
        height: "4.5em",
        alignItems: "center",
        textTransform: "uppercase",
        fontWeight: "600",
        fontSize: ".875em",
        display: "flex",
        borderRadius: "4px",
        outline: "0",
        class: "fa fa-pencil",
        border: "0",
        '&:hover': {
            borderColor: "#9fa9b4",
            backgroundColor: "#134f9e",
        },
        '&:first-child': {
            marginRight: 0,
        },
        '&:last-child': {
            marginLeft: 0,
        },
        '&[data-grey=true]': {
            color: "#5e6b77",
            backgroundColor: "#fff",
            border: "1px solid #e7e8ea",
            outline: 0,
            '&:hover': {
                borderColor: "#9fa9b4",
                backgroundColor: "#f7f8fa",
            }
        },
        '&[data-white=true]': {
            color: "#5e6b77",
            backgroundColor: "#fff",
            border: "1px solid #e7e8ea",
            outline: 0,
            borderColor: "#9fa9b4",
            '&:hover': {
                borderColor: "#9fa9b4",
                backgroundColor: "#f7f8fa",
            }
        },
    },
});


class DigdirIconButton extends Component {

    render() {
        const { classes, textKey, text, grey, t, tReady, ...rest } = this.props;

        const buttonText = text ? text : t(textKey);

        return (
            <Button className={classes.root} variant="outlined" data-grey={grey} disableElevation {...rest}>
                {buttonText}
            </Button>

        );
    }

}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(DigdirIconButton);
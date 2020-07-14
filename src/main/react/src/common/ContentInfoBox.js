import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {withTranslation} from "react-i18next";

const styles = (theme) => ({
    root: {
        border: props => props.warning ? "2px solid indianred" : "2px solid #ffc922",
        borderRadius: "4px",
        padding: "1em 1em 1.5em 4em;",
        margin: "1em 2.2857em",
        position: "relative",
        fontSize: "14px",
        backgroundColor: "#f7f8fa",
        '&::after': {
            content: '""',
            display: "block",
            position: "absolute",
            width: props => props.backgroundImage ? "39px" : "2em",
            height: props => props.backgroundImage ? "42px" : "2em",
            left: "1em",
            top: "1em",
            backgroundRepeat: "no-repeat",
            backgroundImage: props => props.backgroundImage ? props.backgroundImage : "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTAgMTUwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmYzkyMjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDI8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSI3NSIgY3k9Ijc1IiByPSI3NSIvPjxyZWN0IHg9IjY3LjUiIHk9IjM1LjI5IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHJ4PSI4IiByeT0iOCIvPjxyZWN0IHg9IjY3LjUiIHk9IjY1LjI5IiB3aWR0aD0iMTYiIGhlaWdodD0iNTAiIHJ4PSI4IiByeT0iOCIvPjwvZz48L2c+PC9zdmc+)",
        },
        '& a': {
            borderBottom: "1px solid #006cff",
        },
    },
});

class ContentInfoBox extends Component {
    render() {
        const { classes, textKey, t, iconUrl } = this.props;
        const text = t(textKey);

        return (
            <div className={classes.root} style={{fontSize: "14px"}} dangerouslySetInnerHTML={{ __html: `<div> ${text} </div>` }} ></div>
        );
    }
}
const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(ContentInfoBox);
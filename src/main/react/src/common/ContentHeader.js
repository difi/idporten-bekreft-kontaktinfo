import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {observer} from "mobx-react";
import {withTranslation} from "react-i18next";

const styles = (theme) => ({
    root: {
        padding: "0 1rem 0 1rem",
        borderBottom: "1px solid #e6ebf0",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#f7f8fa",
    },
    h2: {
        fontSize: ".875em",
        textTransform: "uppercase",
        color: "#5e6b77",
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
            width: "25px",
            height: "25px",
            left: "0",
            top: "1.25em",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
            backgroundImage: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIwLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2NCA2NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjQgNjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojNkE2QTZBO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTI3LjQsNDAuOEwyNy40LDQwLjhMMjAsNTAuN2wwLDBjLTEsMS45LDAuOSwyLjksMS4xLDNsMCwwdjIuNEgxMGMtMC40LDAtMC44LTAuMy0wLjgtMC44di05YzAsMCwwLDAsMC4xLDAKCWMxLjMtMC4xLDIuMS0wLjksMi4xLTIuMXYtNy43YzAtMC40LTAuMS0wLjgtMC40LTEuMWMtMC40LTAuNi0wLjgtMC45LTEuNy0wLjljMCwwLDAsMC0wLjEsMFYyMy45aDExLjl2Mi40bDAsMAoJYy0wLjIsMC4xLTIuNCwxLTEuNiwyLjhsMCwwTDI3LjQsNDAuOEwyNy40LDQwLjhMMjcuNCw0MC44TDI3LjQsNDAuOHoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTU0LjgsMzQuNUw1NC44LDM0LjVjLTAuOSwwLTEuMywwLjMtMS44LDAuOWMtMC4yLDAuMy0wLjQsMC43LTAuNCwxLjF2Ny43YzAsMS4yLDAuNywyLjEsMi4xLDIuMQoJYzAsMCwwLDAsMC4xLDB2OWMwLDAuNC0wLjMsMC44LTAuOCwwLjhINDIuOXYtMi40bDAsMGMwLjItMC4xLDIuMi0xLjEsMS4xLTNsMCwwbC03LjUtOS45bDAsMGwwLDBsMCwwbDAsMGw3LjktMTEuNmwwLDAKCWMwLjgtMS44LTEuNS0yLjgtMS42LTIuOGwwLDBWMjRoMTEuOUw1NC44LDM0LjVMNTQuOCwzNC41eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTQuOCwxOS43SDkuMnYtOS40YzAtMS4zLDEtMi40LDIuMi0yLjZsMCwwaDYuMnY1LjZoOS4yYzAuNSwwLDAuNy0wLjIsMC43LTAuN1Y3LjdoOS4xdjQuOQoJYzAsMC41LDAuMiwwLjcsMC43LDAuN2g5LjFWNy44aDUuOWMxLjQsMCwyLjUsMS4yLDIuNSwyLjZDNTQuOCwxMC40LDU0LjgsMTkuNyw1NC44LDE5Ljd6Ii8+Cjwvc3ZnPgo=)",

        }
    },
    providerBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#f7f8fa",
        color: "#222",
        lineHeight: "1.5em",
        letterSpacing: ".1px",
    },
    providerImage: {
        height: "2em",
        backgroundImage: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIwLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2NCA2NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjQgNjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojNkE2QTZBO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTI3LjQsNDAuOEwyNy40LDQwLjhMMjAsNTAuN2wwLDBjLTEsMS45LDAuOSwyLjksMS4xLDNsMCwwdjIuNEgxMGMtMC40LDAtMC44LTAuMy0wLjgtMC44di05YzAsMCwwLDAsMC4xLDAKCWMxLjMtMC4xLDIuMS0wLjksMi4xLTIuMXYtNy43YzAtMC40LTAuMS0wLjgtMC40LTEuMWMtMC40LTAuNi0wLjgtMC45LTEuNy0wLjljMCwwLDAsMC0wLjEsMFYyMy45aDExLjl2Mi40bDAsMAoJYy0wLjIsMC4xLTIuNCwxLTEuNiwyLjhsMCwwTDI3LjQsNDAuOEwyNy40LDQwLjhMMjcuNCw0MC44TDI3LjQsNDAuOHoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTU0LjgsMzQuNUw1NC44LDM0LjVjLTAuOSwwLTEuMywwLjMtMS44LDAuOWMtMC4yLDAuMy0wLjQsMC43LTAuNCwxLjF2Ny43YzAsMS4yLDAuNywyLjEsMi4xLDIuMQoJYzAsMCwwLDAsMC4xLDB2OWMwLDAuNC0wLjMsMC44LTAuOCwwLjhINDIuOXYtMi40bDAsMGMwLjItMC4xLDIuMi0xLjEsMS4xLTNsMCwwbC03LjUtOS45bDAsMGwwLDBsMCwwbDAsMGw3LjktMTEuNmwwLDAKCWMwLjgtMS44LTEuNS0yLjgtMS42LTIuOGwwLDBWMjRoMTEuOUw1NC44LDM0LjVMNTQuOCwzNC41eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTQuOCwxOS43SDkuMnYtOS40YzAtMS4zLDEtMi40LDIuMi0yLjZsMCwwaDYuMnY1LjZoOS4yYzAuNSwwLDAuNy0wLjIsMC43LTAuN1Y3LjdoOS4xdjQuOQoJYzAsMC41LDAuMiwwLjcsMC43LDAuN2g5LjFWNy44aDUuOWMxLjQsMCwyLjUsMS4yLDIuNSwyLjZDNTQuOCwxMC40LDU0LjgsMTkuNyw1NC44LDE5Ljd6Ii8+Cjwvc3ZnPgo=)",
    },
});

@observer
class ContentHeader extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div>
                <div className={classes.root} >
                    <h2 className={classes.h2}>Dine kontaktopplysninger</h2>
                    <div className={classes.providerBox}>
                        <img className={classes.providerImage} src={require("../images/svg/eid-icon.svg")} alt="Bekreft kontaktinformasjon" />
                    </div>
                </div>
                <div className={classes.root} >
                    <h1 className={classes.h1}>{this.props.title}</h1>
                </div>
            </div>

        );
    }

}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles))(ContentHeader);
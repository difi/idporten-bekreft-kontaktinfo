import React, {Component} from "react";
import {withStyles, MobileStepper} from "@material-ui/core";

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: "white",
        height: "3em",
        padding: "0",
        '& .MuiMobileStepper-dot.MuiMobileStepper-dotActive': {
            width: "1em",
            height: "1em",
        },
        '& .MuiMobileStepper-dot': {
            width: ".65em",
            height: ".65em",
            margin: "0 4px 0 4px",
        },
        '& .MuiMobileStepper-dots': {
            alignItems: "center",
        },
    },
});

class ContentStepper extends Component {

    render() {
        const {classes, activeStep} = this.props;

        return (
            <MobileStepper
                variant="dots"
                steps={7}
                position="static"
                activeStep={activeStep - 1}
                className={classes.root}
                nextButton={<div></div>}
                backButton={<div></div>}
            />
        );
    }

}

export default withStyles(styles)(ContentStepper);
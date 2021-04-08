import React, {Component} from "react";
import {withStyles} from "@material-ui/core";

class DigdirButtons extends Component {

    render() {
        const { classes, children} = this.props;

        const singleButton = React.Children.count(children) === 1;

        return (
            <div className={classes.root} style={singleButton ? {justifyContent: "center"} : null}>
                {children}
            </div>
        );
    }
}

const styles = () => ({
    root: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "2rem",
        flexWrap: "wrap",
        alignItems: "flex-end",
        '& button:first-child': {
            order: "2",
        }
    },
});

export default withStyles(styles)(DigdirButtons);
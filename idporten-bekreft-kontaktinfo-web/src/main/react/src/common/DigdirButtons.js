import React, {Component} from "react";

import {withStyles} from "@material-ui/core";

const styles = (theme) => ({
    root: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "2rem",
        paddingBottom: "1rem",
        flexWrap: "wrap",
        alignItems: "flex-end",
        '& button:first-child': {
            order: "2",
        }
    },

});


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

export default withStyles(styles)(DigdirButtons);
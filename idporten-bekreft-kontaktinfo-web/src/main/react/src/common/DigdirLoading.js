import React, {Component} from 'react';
import {withStyles, CircularProgress} from "@material-ui/core";

const styles = (theme) => ({
    root: {
        zIndex: theme.zIndex.drawer + 1,
        width: "40px",
        height: "400px",
        margin: "auto",
        position: "relative"
    },

    loader: {
        position: "absolute",
        top: "40%"
    }
});

class DigdirLoading extends Component {
    render() {

        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <CircularProgress className={classes.loader} color="inherit" />
            </div>
        );
    }
}

export default withStyles(styles)(DigdirLoading);
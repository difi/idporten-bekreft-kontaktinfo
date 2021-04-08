import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {observer} from "mobx-react";

@observer
class PageWrapper extends Component {

    render() {
        const { classes, children } = this.props;

        return (
            <React.Fragment>
                <div className={classes.root}>
                    {children}
                </div>
            </React.Fragment>
        );
    }
}

const styles = () => ({
    root: {
        backgroundColor: "#fff",
        padding: "2rem",
    },
});

export default withStyles(styles)(PageWrapper);
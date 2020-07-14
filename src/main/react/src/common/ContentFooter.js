import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {observer} from "mobx-react";

const styles = (theme) => ({
    root: {
        padding: "0 1rem 0 2rem",
        borderTop: "1px solid #e6ebf0",
        minHeight: "3.5em",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#f7f8fa",
        [theme.breakpoints.down('sm')]: {
            visibility: "hidden"
        },
    },

});

@observer
class ContentFooter extends Component {

    render() {
        const { classes } = this.props;
        const {texKey} = this.props;

        return (
            <div className={classes.root} >

            </div>
        );
    }

}

export default withStyles(styles)(ContentFooter);
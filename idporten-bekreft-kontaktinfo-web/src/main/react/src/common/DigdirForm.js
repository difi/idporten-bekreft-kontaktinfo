import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import {observer} from "mobx-react";
import autobind from "autobind-decorator";

@observer
class DigdirForm extends Component {

    @autobind
    validate() {
        return this.formRef.reportValidity(); // will emit 'invalid' event if not valid
    }

    @autobind
    onSubmit(e) {
        e.preventDefault();

        if (this.validate()) {
            const {onSubmitCallback} = this.props;
            if(onSubmitCallback) {
                onSubmitCallback(e);
            }
        }
    }

    render() {
        const { classes, children, onSubmitCallback, ...props } = this.props;

        return (
            <form className={classes.root} ref={form => this.formRef = form} onSubmit={this.onSubmit} {...props}>
                {children}
            </form>
        );
    }
}

const styles = (theme) => ({
    root: {
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            marginRight: "16px",
            marginLeft: 0,
            width: "100%",
        },
    },
});

export default withStyles(styles)(DigdirForm);
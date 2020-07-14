import React, {Component} from 'react';
import {withStyles, Backdrop, CircularProgress} from "@material-ui/core";

const styles = (theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
});

class SimpleBackdrop extends Component {
    render() {
        return (
            <div>
                <Backdrop className={this.props.classes.backdrop} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        );
    }
}

export default withStyles(styles)(SimpleBackdrop);
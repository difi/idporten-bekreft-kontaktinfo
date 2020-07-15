import React, {Component} from 'react';
import {withStyles, Box} from "@material-ui/core";
import {withTranslation} from "react-i18next";
import {inject, observer} from "mobx-react";
// import Error from "@material-ui/icons/Error";

const styles = (theme) => ({
    root: {
        fontFamily: '"Open Sans", sans-serif',
        fontSize: "14px",
    },
    circle: {
        color: "indianred",
        width: "48px",
        height: "48px",
    }

});

@inject("uiStore")
@observer
class NotFound extends Component {

    render() {
        const { classes, t } = this.props;

        return (
            <div>
                <Box display="flex" alignItems="center" flexDirection="column" justifyContent="center" m="2em">
                    {/*<Error className={classes.circle}/>*/}
                    <h4>{t("misc.notfound.title")}</h4>
                    <div style={{fontSize: "14px"}}>
                        <div dangerouslySetInnerHTML={{ __html: t("misc.notfound.text") }} />
                        <br/>
                        <span style={{fontFamily: "monospace"}}>{this.props.location.pathname}</span>
                    </div>

                </Box>

            </div>
        );
    }

}

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(NotFound);
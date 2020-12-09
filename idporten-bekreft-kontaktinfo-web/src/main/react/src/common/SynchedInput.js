import React, {Component} from 'react';
import {observer} from 'mobx-react';
import autobind from "autobind-decorator";
import set from 'lodash/set';
import get from 'lodash/get';
import {observable} from "mobx";
import TextField from "@material-ui/core/TextField";
import {withTranslation} from "react-i18next";

@observer
class SynchedInput extends Component {

    @observable value = "";
    @observable valid = true;

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        const {source, path} = this.props;
        if (source && path) {
            this.value = get(source, path);
        }
    }

    @autobind
    onChange(e) {
        const {source, path, onChangeCallback} = this.props;
        this.value = e.target.value;

        set(source, path, this.value);

        if (onChangeCallback) {
            onChangeCallback(e);
        }
    }

    @autobind
    onValidate() {
        const {path, t, validateCallback} = this.props;

        if (validateCallback) {
            validateCallback(this.value) // validateCallback returns a Promise
                .then((isValid) => {
                    if (!isValid) {
                        const errorText = t("validation." + path);
                        this.inputRef.current.setCustomValidity(errorText); // HTML 5 Constraint Validation API
                    } else { // clear validation error
                        this.inputRef.current.setCustomValidity("");
                        this.valid = true;
                    }
                });
        }
    }

    @autobind
    onInvalid(e) {
        const {t} = this.props;

        // translate browser's built-in error messages
        if (!e.target.validity.customError) {
            let invalidProps = ["badInput", "patternMismatch", "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch", "valueMissing"];
            for (let i = 0; i < invalidProps.length; i++) {
                let prop = invalidProps[i];
                if (e.target.validity[prop] === true) {
                    const errorText = t("validation.html5." + prop);
                    this.inputRef.current.setCustomValidity(errorText);
                    break;
                }
            }
        }

        this.valid = false;
    }

    render() {
        const {source, path, onChangeCallback, validateCallback, textKey, t, tReady, ...rest} = this.props;
        const text = t(textKey);

        const inputProps = {
            tabIndex: 1,
         };

        return (
            <TextField inputRef={this.inputRef}
                       value={this.value}
                       label={textKey ? text : null}
                       error={!this.valid}
                       onChange={this.onChange}
                       onBlur={this.onValidate}
                       onInvalid={this.onInvalid}
                       autoComplete="off"
                       inputProps={inputProps}
                       {...rest}
            />
        );
    }



}

export default withTranslation()(SynchedInput);
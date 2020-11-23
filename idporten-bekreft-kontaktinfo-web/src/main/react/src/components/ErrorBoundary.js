import React, {Component} from 'react';
import Error from "./Error";

class ErrorBoundary extends Component{
    constructor(...args){
        super(...args);
        this.state = {
            catchedError: false
        }
    }
    componentDidCatch(error, errorInfo){
        this.setState({ catchedError: error });
    }

    render(){
        const { children } = this.props;
        const { catchedError } = this.state;

        if (catchedError)
            return <Error />

        return children;
    }
}
export default ErrorBoundary;
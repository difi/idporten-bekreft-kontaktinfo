import React, {Component} from 'react';
import ErrorPage from "./ErrorPage";

class ErrorBoundary extends Component{
    state = { hasError: false, error: null}

    static getDerivedStateFromError(error){
        return {hasError: true, error}
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo)
    }

    render(){
        if (this.state.hasError)
            return <ErrorPage />

        return this.props.children;
    }
}
export default ErrorBoundary;
package no.digdir.krr.bekreft.kontaktinfo.advice;

import no.digdir.krr.bekreft.kontaktinfo.api.exception.ResourceNotFoundException;
import no.digdir.krr.bekreft.kontaktinfo.api.exception.ServiceUnavailableException;
import no.digdir.krr.bekreft.kontaktinfo.api.exception.SQLException;
import no.digdir.krr.bekreft.kontaktinfo.api.exception.UnauthorizedException;
import no.digdir.krr.bekreft.kontaktinfo.api.exception.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {ResourceNotFoundException.class})
    protected ResponseEntity<ExceptionResponse> resourceNotFound(ResourceNotFoundException ex){
        HttpStatus responseType = HttpStatus.NOT_FOUND;
        ExceptionResponse response = new ExceptionResponse();
        response.setErrorMessage(ex.getMessage());
        response.setStatusCode(responseType.toString());
        return new ResponseEntity<>(response, responseType);
    }

    @ExceptionHandler(value = {UnauthorizedException.class})
    protected ResponseEntity<ExceptionResponse> unauthorizedException(UnauthorizedException ex){
        HttpStatus responseType = HttpStatus.UNAUTHORIZED;
        ExceptionResponse response = new ExceptionResponse();
        response.setErrorMessage(ex.getMessage());
        response.setStatusCode(responseType.toString());
        return new ResponseEntity<>(response, responseType);
    }

    @ExceptionHandler(value = {SQLException.class})
    protected ResponseEntity<ExceptionResponse> sqlException(SQLException ex){
        HttpStatus responseType = HttpStatus.BAD_REQUEST;
        ExceptionResponse response = new ExceptionResponse();
        response.setErrorMessage(ex.getMessage());
        response.setStatusCode(responseType.toString());
        return new ResponseEntity<>(response, responseType);
    }

    @ExceptionHandler(value = {ServiceUnavailableException.class})
    protected ResponseEntity<ExceptionResponse> serviceUnavailableException(ServiceUnavailableException ex){
        HttpStatus responseType = HttpStatus.SERVICE_UNAVAILABLE;
        ExceptionResponse response = new ExceptionResponse();
        response.setErrorMessage(ex.getMessage());
        response.setStatusCode(responseType.toString());
        return new ResponseEntity<>(response, responseType);
    }

}

package no.digdir.kontaktinfo.advice;

import no.digdir.kontaktinfo.rest.exception.ExceptionResponse;
import no.digdir.kontaktinfo.rest.exception.ResourceNotFoundException;
import no.digdir.kontaktinfo.rest.exception.SQLException;
import no.digdir.kontaktinfo.rest.exception.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {ResourceNotFoundException.class})
    protected ResponseEntity<ExceptionResponse> resourceNotFound(ResourceNotFoundException ex){
        ExceptionResponse response = new ExceptionResponse();
        response.setErrorMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.NOT_FOUND.toString());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {UnauthorizedException.class})
    protected ResponseEntity<ExceptionResponse> unauthorizedException(UnauthorizedException ex){
        ExceptionResponse response = new ExceptionResponse();
        response.setErrorMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.UNAUTHORIZED.toString());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = {SQLException.class})
    protected ResponseEntity<ExceptionResponse> sqlException(SQLException ex){
        ExceptionResponse response = new ExceptionResponse();
        response.setErrorMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.BAD_REQUEST.toString());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}

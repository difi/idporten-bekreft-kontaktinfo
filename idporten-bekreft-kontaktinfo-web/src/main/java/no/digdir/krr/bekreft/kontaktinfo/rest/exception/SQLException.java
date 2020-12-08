package no.digdir.krr.bekreft.kontaktinfo.rest.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SQLException extends RuntimeException {
    public SQLException(String message){
        super(message);
    }

}
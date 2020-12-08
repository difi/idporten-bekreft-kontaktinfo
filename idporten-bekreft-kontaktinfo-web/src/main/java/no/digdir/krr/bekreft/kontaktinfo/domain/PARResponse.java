package no.digdir.krr.bekreft.kontaktinfo.domain;

import lombok.Data;

@Data
public class PARResponse {
    private int expires_in;

    private String request_uri ;

    public PARResponse(String request_uri, int expires_in) {
        this.request_uri = request_uri;
        this.expires_in = expires_in;
    }
}

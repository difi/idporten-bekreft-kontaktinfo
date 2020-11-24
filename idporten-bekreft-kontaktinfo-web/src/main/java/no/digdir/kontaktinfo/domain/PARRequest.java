package no.digdir.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.io.Serializable;

@Getter
public class PARRequest implements Serializable {

    @JsonProperty(value = "response_type")
    private String responseType;

    @JsonProperty(value = "response_mode")
    private String responseMode;

    @JsonProperty(value = "pid")
    private String pid;

    @JsonProperty(value = "redirect_uri")
    private String redirectUri;

    @JsonProperty(value = "client_id")
    private String clientId;

    @JsonProperty(value = "state")
    private String state;

    //egne openam-felt
    @JsonProperty(value = "goto")
    private String gotoParam;

    @JsonProperty(value = "locale")
    private String locale;

    @JsonProperty(value = "service")
    private String service;
}

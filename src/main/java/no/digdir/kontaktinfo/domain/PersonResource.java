package no.digdir.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PersonResource {

    @JsonProperty(value = "personidentifikator", required = true)
    private String personIdentifier;

    @JsonProperty(value = "reservasjon", required = true)
    private String reserved;

    @JsonProperty(value = "status", required = true)
    private String status;

    @JsonProperty(value = "varslingsstatus")
    private String alertStatus;

    @JsonProperty(value = "kontaktinformasjon")
    private KontaktinfoResource kontaktinfo;

    @JsonProperty(value = "digital_post")
    private DigitalPostResource digitalPost;

    @JsonProperty(value = "sertifikat")
    private String certificate;

    @JsonProperty(value = "spraak")
    private String preferredLanguage;

    @JsonProperty(value = "spraak_oppdatert")
    private String languageUpdated;


}

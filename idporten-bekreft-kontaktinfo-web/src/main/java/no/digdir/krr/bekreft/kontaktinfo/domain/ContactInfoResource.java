package no.digdir.krr.bekreft.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactInfoResource {
    @JsonProperty
    private String email;

    @JsonProperty
    private String mobile;

    @JsonProperty
    private String code;

    @JsonProperty
    private String error;

    public static ContactInfoResource fromPersonResource(PersonResource personResource){
        try {
            return ContactInfoResource.builder()
                    .code(personResource.getCode())
                    .email(personResource.getEmail())
                    .mobile(personResource.getMobile())
                    .build();
        } catch (Exception e){
            return null;
        }
    }
}

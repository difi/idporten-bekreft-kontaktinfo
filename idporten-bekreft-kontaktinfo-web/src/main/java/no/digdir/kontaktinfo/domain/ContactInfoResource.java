package no.digdir.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactInfoResource {
    @JsonProperty
    private String uuid;

    @JsonProperty
    private String email;

    @JsonProperty
    private String mobile;

    public static ContactInfoResource fromPersonResource(PersonResource personResource){
        try {
            return ContactInfoResource.builder()

                    //TODO: replace with session id as uuid
                    .uuid(personResource.getPersonIdentifikator())
                    .email(personResource.getEmail())
                    .mobile(personResource.getMobile())
                    .build();
        } catch (Exception e){
            return null;
        }
    }
}

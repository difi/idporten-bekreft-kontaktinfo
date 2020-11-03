package no.digdir.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdatedUserResource {
    @JsonProperty
    private String fnr;

    @JsonProperty
    private String email;

    @JsonProperty
    private String mobile;
}

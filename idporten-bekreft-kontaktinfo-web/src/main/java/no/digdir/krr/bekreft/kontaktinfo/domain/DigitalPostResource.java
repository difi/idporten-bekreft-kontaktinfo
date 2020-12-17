package no.digdir.krr.bekreft.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import no.difi.kontaktregister.dto.PostboxResource;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DigitalPostResource {

    String postkasseadresse;

    String postkasseleverandoernavn;

    public static DigitalPostResource fromPostboxResource(PostboxResource postboxResource) {
        if (postboxResource == null) {
            return null;
        }

        String postboxleverandoernavn = postboxResource.getPostboxOperator() == null
                ? null
                : postboxResource.getPostboxOperator().getName();

        return DigitalPostResource.builder()
                .postkasseadresse(postboxResource.getAddress())
                .postkasseleverandoernavn(postboxleverandoernavn)
                .build();
    }
}

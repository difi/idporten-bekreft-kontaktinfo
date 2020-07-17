package no.digdir.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DigitalPostResource {

    private String postkasseadresse;

    private String postkasseleverandoeradresse;

    public String getPostkasseadresse() {
        return postkasseadresse;
    }

    public void setPostkasseadresse(String postkasseadresse) {
        this.postkasseadresse = postkasseadresse;
    }

    public String getPostkasseleverandoeradresse() {
        return postkasseleverandoeradresse;
    }

    public void setPostkasseleverandoeradresse(String postkasseleverandoeradresse) {
        this.postkasseleverandoeradresse = postkasseleverandoeradresse;
    }
}

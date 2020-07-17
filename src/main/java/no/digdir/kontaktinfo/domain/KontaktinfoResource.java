package no.digdir.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class KontaktinfoResource {

    @JsonProperty(value = "epostadresse")
    private String email;
    @JsonProperty(value = "epostadresse_oppdatert")
    private String emailUpdated;
    @JsonProperty(value = "epostadresse_sist_verifisert")
    private String emailVerified;
    @JsonProperty(value = "mobiltelefonnummer")
    private String mobile;
    @JsonProperty(value = "mobiltelefonnummer_oppdatert")
    private String mobileUpdated;
    @JsonProperty(value = "mobiltelefonnummer_sist_verifisert")
    private String mobileVerified;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmailUpdated() {
        return emailUpdated;
    }

    public void setEmailUpdated(String emailUpdated) {
        this.emailUpdated = emailUpdated;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getMobileUpdated() {
        return mobileUpdated;
    }

    public void setMobileUpdated(String mobileUpdated) {
        this.mobileUpdated = mobileUpdated;
    }

    public String getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(String emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getMobileVerified() {
        return mobileVerified;
    }

    public void setMobileVerified(String mobileVerified) {
        this.mobileVerified = mobileVerified;
    }
}

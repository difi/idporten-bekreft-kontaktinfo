package no.digdir.kontaktinfo.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.idporten.domain.user.PersonNumber;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PersonResource {

    @JsonProperty(value = "personIdentifikator", required = true)
    private String personIdentifikator;

    @JsonProperty(value = "lastUpdated")
    private Date lastUpdated;

    @JsonProperty(value = "reservasjon")
    private String reserved;

    @JsonProperty(value = "status")
    private String status;

    @JsonProperty(value = "varslingsstatus")
    private String alertStatus;

    @JsonProperty(value = "email")
    private String email;
    @JsonProperty(value = "emailLastUpdated")
    private Date emailLastUpdated;
    @JsonProperty(value = "emailLastVerified")
    private Date emailLastVerified;
    @JsonProperty(value = "mobile")
    private String mobile;
    @JsonProperty(value = "mobileLastUpdated")
    private Date mobileLastUpdated;
    @JsonProperty(value = "mobileLastVerified")
    private Date mobileLastVerified;

    @JsonProperty(value = "digital_post")
    private DigitalPostResource digitalPost;

    @JsonProperty(value = "sertifikat")
    private String certificate;

    @JsonProperty(value = "spraak")
    private String preferredLanguage;

    @JsonProperty(value = "spraak_oppdatert")
    private String languageUpdated;

    @JsonProperty(value = "showDpiInfo")
    private boolean showDpiInfo;

    @JsonProperty(value = "shouldUpdateKontaktinfo")
    private Boolean shouldUpdateKontaktinfo;

    public static PersonResource fromUserDetailResource(UserDetailResource userDetailResource, Integer tipDaysUser) {
        final UserResource userResource = userDetailResource.getUser();
        boolean showDpiInfo = showDpiInfo(userDetailResource, userResource);

        PersonResource personResource = PersonResource.builder()
                .personIdentifikator(userResource.getSsn())
                .email(userResource.getEmail())
                .emailLastUpdated(userResource.getEmailLastUpdated())
                .emailLastVerified(userResource.getEmailVerifiedDate())
                .mobile(userResource.getMobile())
                .mobileLastUpdated(userResource.getMobileLastUpdated())
                .mobileLastVerified(userResource.getMobileVerifiedDate())
                .showDpiInfo(showDpiInfo)
                .lastUpdated(userResource.getLastUpdated())
                .shouldUpdateKontaktinfo(shouldUpdateKontaktinfo(userDetailResource.getUser().getLastUpdated(), tipDaysUser))
                .build();
        log.warn("email: " + personResource.getEmail());
        log.warn("mobile: " + userResource.getMobile() + " - " + personResource.getMobile());
        return personResource;
    }

    public static boolean shouldUpdateKontaktinfo(Date lastUpdated, Integer tipDaysUser) {
        LocalDate lastUpdatedDate = lastUpdated.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return LocalDate.now().minusDays(tipDaysUser).isAfter(lastUpdatedDate);
    }

    public static PersonResource fromPersonIdentifier(String personIdentifikator) {
        return PersonResource.builder()
                .personIdentifikator(personIdentifikator)
                .build();
    }

    private static boolean showDpiInfo(UserDetailResource userDetailResource, UserResource userResource) {
        //  Må finne en fornuftig featureswitch her
        //        if (spTurnOffDpiInfo) {
//            return false;
//        }

        if (userResource.isReserved()) {
            return false;
        }
        if (userDetailResource.getActivePostbox() != null && userDetailResource.getActivePostbox().isActive()) {
            return false;
        }

        if(userResource.getEmail() == null || userResource.getEmail().trim().equals("")){
            return false;
        }

        final PersonNumber personNumber = new PersonNumber(userResource.getSsn());
        if(personNumber.isDnummer()){
            return true;
        }
        if (personNumber.isYoungerThan18()) {
            return false;
        }

        return true;
    }

    public Boolean getShouldUpdateKontaktinfo() {
        return shouldUpdateKontaktinfo;
    }

}
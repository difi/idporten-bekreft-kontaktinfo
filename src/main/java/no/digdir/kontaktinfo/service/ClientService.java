package no.digdir.kontaktinfo.service;

import lombok.extern.slf4j.Slf4j;
import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.kontaktinfo.config.KrrConfigProvider;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.integration.KontaktregisterClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class ClientService {
    public static List<MediaType> ACCEPT_MEDIA_TYPES = Collections.singletonList(MediaType.APPLICATION_JSON);

    private final KrrConfigProvider krrConfigProvider;
    private final KontaktregisterClient kontaktregisterClient;

    @Autowired
    public ClientService(KrrConfigProvider krrConfigProvider, KontaktregisterClient kontaktregisterClient) {
        this.krrConfigProvider = krrConfigProvider;
        this.kontaktregisterClient = kontaktregisterClient;
    }

    public PersonResource getKontaktinfo(String fnr) {
        UserDetailResource userDetailResource = kontaktregisterClient.getUser(fnr);

        if (userDetailResource.getUser() != null) {
            return PersonResource.fromUserDetailResource(userDetailResource,
                    krrConfigProvider.getTipDaysUser());
        } else {
            // user does not exist in KRR, create local PersonResource
            return PersonResource.builder()
                    .personIdentifikator(fnr).newUser(true).build();
        }
    }

    public void updateKontaktinfo(String fnr, String email, String mobile) {
        UserDetailResource userDetail = kontaktregisterClient.getUser(fnr);

        if (userDetail.getUser() != null) {
            updateUser(userDetail.getUser(), email, mobile);
        } else {
            createUser(createNewUserResource(fnr), email, mobile);
        }
    }

    private void createUser(UserResource user, String email, String mobile) {
        updateUserResource(user, email, mobile);
        kontaktregisterClient.createUser(user);
    }

    private void updateUser(UserResource user, String email, String mobile) {
        updateUserResource(user, email, mobile);
        kontaktregisterClient.updateUser(user);
    }

    private void updateUserResource(UserResource user, String email, String mobile) {
        // KRR accepts only NULL if value should be removed
        email = ((email.equals("")) ? null : email);
        mobile = ((mobile.equals("")) ? null : mobile);

        if (!Objects.equals(user.getEmail(), email)) {
            user.setEmail(email);
            user.setEmailLastUpdated(new Date());
        }
        if (!Objects.equals(user.getMobile(), mobile)) {
            user.setMobile(mobile);
            user.setMobileLastUpdated(new Date());
        }
        if (user.getEmail() != null) {
            user.setEmailVerifiedDate(new Date());
        }
        if (user.getMobile() != null) {
            user.setMobileVerifiedDate(new Date());
        }
    }

    private UserResource createNewUserResource(String fnr) {
        UserResource userResource = new UserResource();
        userResource.setSsn(fnr);
        return userResource;
    }
}

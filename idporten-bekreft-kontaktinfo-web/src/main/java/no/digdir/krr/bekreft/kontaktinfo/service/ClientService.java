package no.digdir.krr.bekreft.kontaktinfo.service;

import lombok.extern.slf4j.Slf4j;
import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.krr.bekreft.kontaktinfo.logging.audit.AuditService;
import no.digdir.krr.bekreft.kontaktinfo.config.KrrConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.domain.PersonResource;
import no.digdir.krr.bekreft.kontaktinfo.integration.KontaktregisterClient;
import no.digdir.krr.bekreft.kontaktinfo.api.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;


@Service
@Slf4j
public class ClientService {
    private final KrrConfigProvider krrConfigProvider;
    private final KontaktregisterClient kontaktregisterClient;

    private AuditService auditService;

    @Autowired
    public ClientService(KrrConfigProvider krrConfigProvider, KontaktregisterClient kontaktregisterClient, AuditService auditService) {
        this.krrConfigProvider = krrConfigProvider;
        this.kontaktregisterClient = kontaktregisterClient;
        this.auditService = auditService;
    }

    public PersonResource getKontaktinfo(String fnr) {
        UserDetailResource userDetailResource = kontaktregisterClient.getUser(fnr);

        if (userDetailResource == null) {
            log.error("could not connect to KRR");
            return null;
        }

        if (userDetailResource.getUser() != null) {
            return PersonResource.fromUserDetailResource(userDetailResource,
                    krrConfigProvider.getTipDaysUser());
        } else {
            return PersonResource.builder()
                    .personIdentifikator(fnr)
                    .newUser(true)
                    .status(PersonResource.NOT_REGISTERED)
                    .build();
        }
    }

    public void updateKontaktinfo(String fnr, String email, String mobile) {
        UserDetailResource userDetail = kontaktregisterClient.getUser(fnr);

        if (userDetail == null) {
            throw new ResourceNotFoundException("Could not retrieve user resource from Kontaktregisteret");
        }

        if (userDetail.getUser() != null) {
            updateUser(userDetail.getUser(), email, mobile);
        } else {
            createUser(createNewUserResource(fnr), email, mobile);
        }
    }

    private void createUser(UserResource user, String email, String mobile) {
        updateUserResource(user, email, mobile);
        kontaktregisterClient.createUser(user);
        auditService.auditContactInfoCreate(user.getSsn(),email,mobile);
    }

    private void updateUser(UserResource user, String email, String mobile) {
        updateUserResource(user, email, mobile);
        kontaktregisterClient.updateUser(user);
        auditService.auditContactInfoConfirm(user.getSsn(),email,mobile);
    }

    private void updateUserResource(UserResource user, String email, String mobile) {
        // KRR accepts only NULL if value should be removed
        email = ((email.equals("")) ? null : email);
        mobile = ((mobile.equals("")) ? null : mobile);

        if (!Objects.equals(user.getEmail(), email)) {
            auditService.auditContactInfoUpdateEmail(user.getSsn(),user.getEmail(),email);
            user.setEmail(email);
            user.setEmailLastUpdated(new Date());
        }
        if (!Objects.equals(user.getMobile(), mobile)) {
            auditService.auditContactInfoUpdateMobile(user.getSsn(),user.getMobile(),mobile);
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

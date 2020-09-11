package no.digdir.kontaktinfo.service;

import lombok.extern.slf4j.Slf4j;
import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.kontaktinfo.config.KrrConfigProvider;
import no.digdir.kontaktinfo.domain.PersonResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class ClientService {
    public static List<MediaType> ACCEPT_MEDIA_TYPES = Collections.singletonList(MediaType.APPLICATION_JSON);

    HttpEntity<Object> httpEntity = createHttpEntity();

    private final RestTemplate restTemplate;
    private final KrrConfigProvider krrConfigProvider;

    @Autowired
    public ClientService(RestTemplate restTemplate, KrrConfigProvider krrConfigProvider) {
        this.restTemplate = restTemplate;
        this.krrConfigProvider = krrConfigProvider;
    }

    public PersonResource getPersonForFnr(String fnr) {
        return PersonResource.fromUserDetailResource(getUserDetailResourceForFnr(fnr),
                krrConfigProvider.getTipDaysUser());
    }

    private UserDetailResource getUserDetailResourceForFnr(String fnr) {
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/userDetail?ssn={ssn}";
        try {
            ResponseEntity<UserDetailResource> responseEntity = restTemplate.exchange(url, HttpMethod.GET, httpEntity, UserDetailResource.class, fnr);
            return responseEntity.getBody();
        } catch (RestClientException e) {
            log.error("Failed to retrieve digital contact info for user", e);
            return null;
        }
    }

    private UserResource createNewUserResource(String fnr) {
        UserResource userResource = new UserResource();
        userResource.setSsn(fnr);
        return userResource;
    }

    public void updateContactInfo(String fnr, String email, String mobile) {
        UserDetailResource userDetail = getUserDetailResourceForFnr(fnr);
        if (userDetail == null) {
            addNewUser(createNewUserResource(fnr), email, mobile);
        } else {
            updateUser(userDetail.getUser(), email, mobile);
        }
    }

    private void addNewUser(UserResource user, String emailAddress, String mobile) {
        updateUserResource(user, emailAddress, mobile);
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/";
        try {
            restTemplate.postForObject(url, createHttpEntity(user), UserResource.class);
        } catch (RestClientException e) {
            log.error("Failed to add user", e);
        }
    }

    private void updateUser(UserResource user, String emailAddress, String mobile) {
        updateUserResource(user, emailAddress, mobile);
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/{uuid}";
        try {
            restTemplate.exchange(url, HttpMethod.PUT, createHttpEntity(user), UserResource.class, user.getUuid());
        } catch (RestClientException e) {
            log.error("Failed to update user", e);
        } catch (Exception e) {
            log.error("Hvilken feil? ", e);
        }
    }

    private void updateUserResource(UserResource user, String emailAddress, String mobile) {
        if (!Objects.equals(user.getMobile(), mobile)) {
            user.setMobile(mobile);
            user.setMobileLastUpdated(new Date());
        }
        if (!Objects.equals(user.getEmail(), emailAddress)) {
            user.setEmail(emailAddress);
            user.setEmailLastUpdated(new Date());
        }
        if (user.getMobile() != null) {
            user.setMobileVerifiedDate(new Date());
        }
        if (user.getEmail() != null) {
            user.setEmailVerifiedDate(new Date());
        }
    }

    private HttpEntity<Object> createHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Client-Id", "Idporten");
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(ACCEPT_MEDIA_TYPES);
        return new HttpEntity<>(headers);
    }

    private HttpEntity<Object> createHttpEntity(UserResource userDetail) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Client-Id", "Idporten");
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(ACCEPT_MEDIA_TYPES);
        return new HttpEntity<>(userDetail, headers);
    }
}

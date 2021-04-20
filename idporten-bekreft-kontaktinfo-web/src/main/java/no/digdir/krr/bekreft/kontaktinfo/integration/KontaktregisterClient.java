package no.digdir.krr.bekreft.kontaktinfo.integration;

import lombok.extern.slf4j.Slf4j;
import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.krr.bekreft.kontaktinfo.config.KrrConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.api.exception.SQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import javax.cache.annotation.CacheResult;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class KontaktregisterClient {
    public static List<MediaType> ACCEPT_MEDIA_TYPES = Collections.singletonList(MediaType.APPLICATION_JSON);

    HttpEntity<Object> httpEntity = createHttpEntity();

    private final RestTemplate restTemplate;
    private final KrrConfigProvider krrConfigProvider;

    @Autowired
    public KontaktregisterClient(RestTemplate restTemplate, KrrConfigProvider krrConfigProvider) {
        this.restTemplate = restTemplate;
        this.krrConfigProvider = krrConfigProvider;
    }

    @CacheResult(cacheName = "user-detail")
    public UserDetailResource getUser(String fnr) {
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/userDetail?ssn={ssn}";
        try {
            ResponseEntity<UserDetailResource> responseEntity = restTemplate.exchange(url, HttpMethod.GET, httpEntity, UserDetailResource.class, fnr);
            return responseEntity.getBody();
        } catch (Exception e) {
            log.error("could not get user from kontaktregister");
            return null;
        }
    }

    public void createUser(UserResource user) {
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/";
        try {
            restTemplate.postForObject(url, createHttpEntity(user), UserResource.class);
        } catch (RestClientException e) {
            log.error("failed to create user", e);
            throw new SQLException("Bad Request");
        }
    }

    public void updateUser(UserResource user) {
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/{uuid}";
        try {
            restTemplate.exchange(url, HttpMethod.PUT, createHttpEntity(user), UserResource.class, user.getUuid());
        } catch (Exception e) {
            log.error("failed to update user", e);
            throw new SQLException("Bad Request");
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

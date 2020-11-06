package no.digdir.kontaktinfo.integration;

import lombok.extern.slf4j.Slf4j;
import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.kontaktinfo.config.KrrConfigProvider;
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
        } catch (RestClientException e) {
            log.error("failed to retrieve user from kontaktregister", e);
            return null;
        } catch (Exception e) {
            log.error("something is wrong with the request to KRR", e);
            return null;
        }
    }

    public void createUser(UserResource user) {
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/";
        try {
            restTemplate.postForObject(url, createHttpEntity(user), UserResource.class);
        } catch (RestClientException e) {
            log.error("failed to create user in kontaktregister", e);
        }
    }

    public void updateUser(UserResource user) {
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/{uuid}";
        try {
            restTemplate.exchange(url, HttpMethod.PUT, createHttpEntity(user), UserResource.class, user.getUuid());
        } catch (RestClientException e) {
            log.error("failed to update user in kontaktregister", e);
        } catch (Exception e) {
            log.error("something went wrong", e);
        }
    }

    public boolean isAlive() {
        String url = krrConfigProvider.getUrl() + "/smoketest";

        try {
            ResponseEntity<String> responseEntity = restTemplate.getForEntity(url + "smoketest/", String.class);
            return !responseEntity.getBody().contains("FAILED") && !responseEntity.getBody().contains("\"status\": \"DOWN\"");
        } catch (Exception e) {
            return false;
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

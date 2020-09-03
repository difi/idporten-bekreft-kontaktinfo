package no.digdir.kontaktinfo.service;

import no.difi.kontaktregister.dto.UserDetailResource;
import no.digdir.kontaktinfo.config.KrrConfigProvider;
import no.digdir.kontaktinfo.domain.PersonResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
public class ClientService {
    public static List<MediaType> ACCEPT_MEDIA_TYPES = Collections.singletonList(MediaType.APPLICATION_JSON);

    HttpEntity<Object> httpEntity = createHttpEntity();

    private RestTemplate restTemplate;
    private KrrConfigProvider krrConfigProvider;

    @Autowired
    public ClientService(RestTemplate restTemplate, KrrConfigProvider krrConfigProvider) {
        this.restTemplate = restTemplate;
        this.krrConfigProvider = krrConfigProvider;
    }

    public PersonResource getPersonForFnr(String fnr) {
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/userDetail?ssn={ssn}";
        ResponseEntity<UserDetailResource> responseEntity = restTemplate.exchange(url, HttpMethod.GET, httpEntity, UserDetailResource.class, fnr);

        if (responseEntity.getBody() != null) {
            return PersonResource.fromUserDetailResource(responseEntity.getBody(), krrConfigProvider.getTipDaysUser());
        } else {
            return PersonResource.fromPersonIdentifier(fnr);
        }
    }

    protected HttpEntity<Object> createHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Client-Id", "Idporten");
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(ACCEPT_MEDIA_TYPES);
        return new HttpEntity<>(headers);
    }
}

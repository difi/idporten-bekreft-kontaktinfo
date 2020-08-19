package no.digdir.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.difi.kontaktregister.dto.UserDetailResource;
import no.digdir.kontaktinfo.config.KrrConfigProvider;
import no.digdir.kontaktinfo.domain.DigitalPostResource;
import no.digdir.kontaktinfo.domain.KontaktinfoResource;
import no.digdir.kontaktinfo.domain.PersonResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class KontaktinfoBackendEndpoint {
    public static List<MediaType> ACCEPT_MEDIA_TYPES = Collections.singletonList(MediaType.APPLICATION_JSON);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private KrrConfigProvider krrConfigProvider;

    @GetMapping("/kontaktinfo/{fnr}")
    public PersonResource getKontaktinfo(String fnr) {
        //TODO: kall idporten for å få fødselsnummer til code
        //TODO: Kall kontaktinfo-backend for å få kontaktinfo for fødselsnummer
//        return createKontaktinfoStub();
        log.info("kontaktinfo: " + fnr);
        return getKontaktinfoForFnr(fnr);
    }

    private PersonResource getKontaktinfoForFnr(String fnr) {
        log.info("fnr: " + fnr);
        String fnrForTest = fnr == null ? "23079421936" : fnr;
        log.info("fnrForTest: " + fnrForTest);
        HttpEntity<Object> httpEntity = createHttpEntity();
        String url = krrConfigProvider.getUrl() + "/kontaktregister/users/userDetail?ssn={ssn}";
        ResponseEntity<UserDetailResource> responseEntity = restTemplate.exchange(url, HttpMethod.GET, httpEntity, UserDetailResource.class, fnrForTest);
        if (responseEntity.getBody() != null) {
            return PersonResource.fromUserDetailResource(responseEntity.getBody(), krrConfigProvider.getTipDaysUser());
        } else {
            return PersonResource.fromPersonIdentifier(fnrForTest);
        }
    }

    private PersonResource createKontaktinfoStub() {
        KontaktinfoResource kontaktinfo = KontaktinfoResource.builder()
                .email("noone@nowhere.com")
                .build();
        DigitalPostResource digitalPost = DigitalPostResource.builder()
                .postkasseadresse("postkasseadresse")
                .postkasseleverandoeradresse("Digipost")
                .build();
        return PersonResource.builder()
                .kontaktinfo(kontaktinfo)
                .digitalPost(digitalPost)
                .build();
    }


    protected HttpEntity<Object> createHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Client-Id", "Idporten");
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(ACCEPT_MEDIA_TYPES);
        return new HttpEntity<Object>(headers);
    }
}

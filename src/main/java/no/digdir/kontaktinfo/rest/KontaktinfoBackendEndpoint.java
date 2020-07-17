package no.digdir.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.KontaktinfoResource;
import no.digdir.kontaktinfo.domain.DigitalPostResource;
import no.digdir.kontaktinfo.domain.PersonResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class KontaktinfoBackendEndpoint {

    @GetMapping("/kontaktinfo")
    public PersonResource getKontaktinfo(String code) {
        //TODO: kall idporten for å få fødselsnummer til code
        //TODO: Kall kontaktinfo-backend for å få kontaktinfo for fødselsnummer
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
}

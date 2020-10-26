package no.digdir.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.domain.UpdatedUserResource;
import no.digdir.kontaktinfo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class KontaktinfoEndpoint {
    public static List<MediaType> ACCEPT_MEDIA_TYPES = Collections.singletonList(MediaType.APPLICATION_JSON);

    @Autowired
    ClientService clientService;

    @GetMapping("/kontaktinfo/{fnr}")
    public PersonResource getKontaktinfo(@PathVariable String fnr) {
        return clientService.getKontaktinfo(fnr);
    }

    @PostMapping("/kontaktinfo")
    public void updateKontaktinfo(@RequestBody UpdatedUserResource user) {
        clientService.updateKontaktinfo(user.getFnr(), user.getEmail(), user.getMobile());
    }
}
package no.digdir.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.domain.ContactInfoResource;
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

    @PostMapping("/kontaktinfo")
    public void updateKontaktinfo(@RequestBody ContactInfoResource resource) {

        //TODO: get fnr from cache using uuid as key
        String fnr = resource.getUuid();

        //TODO: if cache did not return any fnr; return 401? error handling in React

        clientService.updateKontaktinfo(fnr, resource.getEmail(), resource.getMobile());
    }
}
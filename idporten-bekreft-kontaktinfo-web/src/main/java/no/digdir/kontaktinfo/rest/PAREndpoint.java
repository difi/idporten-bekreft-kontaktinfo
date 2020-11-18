package no.digdir.kontaktinfo.rest;

import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.controller.ContactInfoController;
import no.digdir.kontaktinfo.domain.PARRequest;
import no.digdir.kontaktinfo.domain.PARResponse;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import no.digdir.kontaktinfo.service.KontaktinfoCache;
import no.digdir.kontaktinfo.service.PARService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api")
public class PAREndpoint {
    private final ContactInfoController contactInfoController;
    private final PARService parService;
    private final KontaktinfoCache kontaktinfoCache;

    @Value("${par.cache.ttl-in-s:120}")
    private int ttl;

    public PAREndpoint(PARService parService, KontaktinfoCache kontaktinfoCache, ContactInfoController contactInfoController) {
        this.contactInfoController = contactInfoController;
        this.parService = parService;
        this.kontaktinfoCache = kontaktinfoCache;
    }

    @PostMapping("/par")
    @ResponseBody
    public ResponseEntity<PARResponse> par(@RequestBody PARRequest parRequest) {
        String requestUri = parService.generateRequestUri();
        kontaktinfoCache.putParRequest(requestUri, parRequest);
        kontaktinfoCache.putPid(requestUri, parRequest.getPid());
        PARResponse response = new PARResponse(requestUri, ttl);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/authorize")
    public Object authorize(@PathVariable String requestUri) {
        String uuid = requestUri;
        PARRequest parRequest = kontaktinfoCache.getParRequest(uuid);
        return contactInfoController.confirm(kontaktinfoCache.getPid(uuid), parRequest.getGotoParam(), parRequest.getLocale());
    }

    @PostMapping("/token")
    public Object token(@RequestBody String code) {
        PersonResource kontaktinfo = kontaktinfoCache.getPersonResource(code);
        String jwt = parService.makeJwt(kontaktinfo.getPersonIdentifikator(), kontaktinfo.getEmail(), kontaktinfo.getMobile());
        kontaktinfoCache.removePersonResource(code);
        return jwt;
    }
}

package no.digdir.kontaktinfo.service;

import no.digdir.kontaktinfo.domain.PARRequest;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.rest.exception.ResourceNotFoundException;
import no.digdir.kontaktinfo.rest.exception.UnauthorizedException;
import org.infinispan.Cache;
import org.springframework.stereotype.Component;

import java.util.UUID;


@Component
public class KontaktinfoCache {

    private final InfinispanCacheManager cacheManager;
    private final String PERSON_RESOURCE_CACHE = "kontaktinfo";
    private final String PID_CACHE = "pid";
    private final String PAR_REQUEST_CACHE = "parRequest";

    public KontaktinfoCache(InfinispanCacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public void putPid(String uuid, String pid) {
        Cache<String, String> pidCache = cacheManager.getCache(PID_CACHE);
        pidCache.put(uuid, pid);
    }

    public String getPid(String uuid) {
        Cache<String, String> pidCache = cacheManager.getCache(PID_CACHE);
        return pidCache.get(uuid);
    }

    public void removeUuid(String uuid) {
        Cache<String, String> pidCache = cacheManager.getCache(PID_CACHE);
        Cache<String, Object> parRequestCache = cacheManager.getCache(PAR_REQUEST_CACHE);
        pidCache.remove(uuid);
        parRequestCache.remove(uuid);
    }

    public void putParRequest(String uuid, PARRequest parRequest) {
        Cache<String, PARRequest> parRequestCache = cacheManager.getCache(PAR_REQUEST_CACHE);
        parRequestCache.put(uuid, parRequest);
    }

    public PARRequest getParRequest(String uuid) {
        Cache<String, PARRequest> parRequestCache = cacheManager.getCache(PAR_REQUEST_CACHE);
        return parRequestCache.get(uuid);
    }

    public String putPersonResource(PersonResource personResource) {
        String code = UUID.randomUUID().toString();
        Cache<String, PersonResource> personResourceCache = cacheManager.getCache(PERSON_RESOURCE_CACHE);
        personResourceCache.put(code, personResource);
        return code;
    }

    public PersonResource getPersonResource(String uuid) {
        try {
            Cache<String, PersonResource> personResourceCache = cacheManager.getCache(PERSON_RESOURCE_CACHE);
            return personResourceCache.get(uuid);
        } catch (Exception e){
            return null;
        }
    }

    public void removePersonResource(String uuid) {
        Cache<String, PersonResource> personResourceCache = cacheManager.getCache(PERSON_RESOURCE_CACHE);
        personResourceCache.remove(uuid);
    }

}

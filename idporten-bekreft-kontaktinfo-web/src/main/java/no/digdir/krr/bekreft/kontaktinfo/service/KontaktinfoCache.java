package no.digdir.krr.bekreft.kontaktinfo.service;

import no.digdir.krr.bekreft.kontaktinfo.domain.PersonResource;
import no.idporten.sdk.oidcserver.cache.OpenIDConnectCache;
import no.idporten.sdk.oidcserver.protocol.Authorization;
import no.idporten.sdk.oidcserver.protocol.PushedAuthorizationRequest;
import org.infinispan.Cache;
import org.springframework.stereotype.Component;

import java.util.UUID;


@Component
public class KontaktinfoCache implements OpenIDConnectCache {

    private final InfinispanCacheManager cacheManager;
    private final String PERSON_RESOURCE_CACHE = "personCache";
    private final String PAR_CACHE = "parcache";
    private final String AUTH_CACHE = "authcache";

    public KontaktinfoCache(InfinispanCacheManager cacheManager) {
        this.cacheManager = cacheManager;
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
        } catch (Exception e) {
            return null;
        }
    }

    public void removePersonResource(String uuid) {
        Cache<String, PersonResource> personResourceCache = cacheManager.getCache(PERSON_RESOURCE_CACHE);
        personResourceCache.remove(uuid);
    }

    @Override
    public void putAuthorizationRequest(String requestUri, PushedAuthorizationRequest pushedAuthorizationRequest) {
        cacheManager.getCache(PAR_CACHE).put(requestUri, pushedAuthorizationRequest);
    }

    @Override
    public PushedAuthorizationRequest getAuthorizationRequest(String requestUri) {
        return (PushedAuthorizationRequest) cacheManager.getCache(PAR_CACHE).get(requestUri);
    }

    @Override
    public void removeAuthorizationRequest(String requestUri) {
        cacheManager.getCache(PAR_CACHE).remove(requestUri);
    }

    @Override
    public void putAuthorization(String code, Authorization authorization) {
        cacheManager.getCache(AUTH_CACHE).put(code, authorization);
    }

    @Override
    public Authorization getAuthorization(String code) {
        return (Authorization) cacheManager.getCache(AUTH_CACHE).get(code);
    }

    @Override
    public void removeAuthorization(String code) {
        cacheManager.getCache(AUTH_CACHE).remove(code);
    }
}

package no.digdir.kontaktinfo.service;

import org.infinispan.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class KontaktinfoCache {

    private final InfinispanCacheManager cacheManager;
    private final String KONTAKTINFO_CACHE = "kontaktinfo";
    private final String FNR_CACHE = "fnr";
    private final String PAR_REQUEST_CACHE = "parRequest";

    public KontaktinfoCache(InfinispanCacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public void putFnr(String uuid, String fnr) {
        Cache<String, String> fnrCache = cacheManager.getCache(FNR_CACHE);
        fnrCache.put(uuid, fnr);
    }

    public String getFnr(String uuid) {
        Cache<String, String> fnrCache = cacheManager.getCache(FNR_CACHE);
        return fnrCache.get(uuid);
    }

    public void removeUuid(String uuid) {
        Cache<String, String> fnrCache = cacheManager.getCache(FNR_CACHE);
        Cache<String, Object> parRequestCache = cacheManager.getCache(PAR_REQUEST_CACHE);
        fnrCache.remove(uuid);
        parRequestCache.remove(uuid);
    }

    public void putParRequest(String uuid, Object parRequest) {
        Cache<String, Object> parRequestCache = cacheManager.getCache(PAR_REQUEST_CACHE);
        parRequestCache.put(uuid, parRequest);
    }

    public Object getParRequest(String uuid) {
        Cache<String, Object> parRequestCache = cacheManager.getCache(PAR_REQUEST_CACHE);
        return parRequestCache.get(uuid);
    }

    public void putKontaktinfo(String uuid, Object kontaktinfo) {
        Cache<String, Object> kontaktinfoCache = cacheManager.getCache(KONTAKTINFO_CACHE);
        kontaktinfoCache.put(uuid, kontaktinfo);
    }

    public Object getKontaktinfo(String uuid) {
        Cache<String, Object> kontaktinfoCache = cacheManager.getCache(KONTAKTINFO_CACHE);
        return kontaktinfoCache.get(uuid);
    }

    public void removeKontaktinfo(String uuid) {
        Cache<String, String> kontaktinfoCache = cacheManager.getCache(KONTAKTINFO_CACHE);
        kontaktinfoCache.remove(uuid);
    }

}

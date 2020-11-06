package no.digdir.kontaktinfo.service;

import org.infinispan.configuration.cache.Configuration;
import org.infinispan.configuration.global.GlobalConfiguration;
import org.infinispan.manager.DefaultCacheManager;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class InfinispanCacheManager extends DefaultCacheManager {

    public InfinispanCacheManager(@Qualifier("globalCacheConfig") GlobalConfiguration globalConfiguration, @Qualifier("cacheConfig") Configuration configuration) {
        super(globalConfiguration, configuration);
    }
}

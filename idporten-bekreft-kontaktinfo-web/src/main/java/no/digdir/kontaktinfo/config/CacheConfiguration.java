package no.digdir.kontaktinfo.config;

import org.infinispan.configuration.cache.CacheMode;
import org.infinispan.configuration.cache.ConfigurationBuilder;
import org.infinispan.configuration.global.GlobalConfiguration;
import org.infinispan.configuration.global.GlobalConfigurationBuilder;
import org.infinispan.manager.DefaultCacheManager;
import org.infinispan.manager.EmbeddedCacheManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import static java.util.concurrent.TimeUnit.SECONDS;

@Configuration
@EnableCaching(proxyTargetClass = true)
@ConditionalOnExpression("'${spring.cache.type}'!='none'")
public class CacheConfiguration {


    @Value("${cache.local.ttl-in-s:5}")
    private int localTtl;

    @Value("${cache.cluster.ttl-in-s:300}")
    private int clusterTtl;

    @Value("${cache.cluster.transport.file.location}")
    private String location;

    @Bean("cacheConfig")
    public org.infinispan.configuration.cache.Configuration configuration() {
        ConfigurationBuilder builder = new ConfigurationBuilder();
        builder.expiration()
                .lifespan(clusterTtl, SECONDS)
                .clustering().cacheMode(CacheMode.REPL_SYNC);
        return builder.build();
    }

    @Bean("globalCacheConfig")
    public GlobalConfiguration globalConfiguration() {
        return GlobalConfigurationBuilder.defaultClusteredBuilder()
                .transport().addProperty("configurationFile", location + "cache-transport.xml")
                .clusterName("oidc-provider-cache-cluster")
                .build();
    }

    @Bean
    @Primary
    public EmbeddedCacheManager localCacheManager() {
        ConfigurationBuilder builder = new ConfigurationBuilder();
        final org.infinispan.configuration.cache.Configuration config = builder.expiration()
                .lifespan(localTtl, SECONDS).build();
        EmbeddedCacheManager defaultCacheManager = new DefaultCacheManager(config);
        return defaultCacheManager;
    }

}

package no.digdir.kontaktinfo.service;


import no.digdir.kontaktinfo.integration.KontaktregisterClient;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CacheTest {

    @Autowired
    private WebApplicationContext springContext;

    @Autowired
    ClientService clientService;

    @Autowired
    KontaktregisterClient kontaktregisterClient;

    @Autowired
    private CacheManager cacheManager;

    @Before
    public void setUp() {
        Cache ccache = cacheManager.getCache("user-detail");
        ccache.clear();
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void check_user_detail_cache() throws Exception {
        Cache cache = cacheManager.getCache("user-detail");
        assertNull(cache.get("fnr"));
        cache.put("fnr", "test");
        assertNotNull(cache.get("fnr"));
        //TODO: Ordentlig test med wiremock og greier!
    }

}

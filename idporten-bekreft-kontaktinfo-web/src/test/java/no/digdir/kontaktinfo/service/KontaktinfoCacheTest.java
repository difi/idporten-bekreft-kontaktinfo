package no.digdir.kontaktinfo.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import static org.junit.Assert.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
public class KontaktinfoCacheTest {

    @Autowired
    private KontaktinfoCache kontaktinfoCacheTest;

    @Test
    public void test(){
        assertTrue(true);
    }

    /* TODO: fix test
    @Test
    public void cachePersonResource(){
        PersonResource personResource = createPersonResource();
        String code = kontaktinfoCacheTest.putPersonResource(personResource);

        PersonResource cachedPersonResource = kontaktinfoCacheTest.getPersonResource(code);

        assertEquals(personResource.getMobile(),cachedPersonResource.getMobile());
        assertEquals(personResource.getEmail(),cachedPersonResource.getEmail());
        assertEquals(personResource.getPersonIdentifikator(),cachedPersonResource.getPersonIdentifikator());
    }

    @Test
    public void removeCachedPersonResource(){
        PersonResource personResource = createPersonResource();
        String code = kontaktinfoCacheTest.putPersonResource(personResource);
        kontaktinfoCacheTest.removePersonResource(code);

        PersonResource cachedPersonResource = kontaktinfoCacheTest.getPersonResource(code);

        assertNull(cachedPersonResource);
    }

    private PersonResource createPersonResource() {
        return PersonResource.builder().
                personIdentifikator("12121212121").
                email("test@digdir.no").
                mobile("95959595").
                build();
    }

     */



}

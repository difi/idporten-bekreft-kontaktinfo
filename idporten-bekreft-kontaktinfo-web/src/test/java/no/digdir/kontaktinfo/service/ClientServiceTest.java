package no.digdir.kontaktinfo.service;

import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.integration.KontaktregisterClient;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import java.util.Date;
import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;

@RunWith(SpringRunner.class)
@SpringBootTest
class ClientServiceTest {

    @Autowired
    private ClientService clientService;

    @MockBean
    private KontaktregisterClient kontaktregisterClient;

    @Captor
    ArgumentCaptor<UserResource> userCaptor;

    @Test
    void getKontaktinfo() {
        String fnr = "23079417815";
        String email = "retrieved@digdir.no";
        String mobile = "22224444";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr,email,mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);

        assertEquals(fnr, personResource.getPersonIdentifikator());
        assertEquals(email, personResource.getEmail());
        assertEquals(mobile, personResource.getMobile());
    }

    @Test
    void createKontaktinfo() {
        String fnr = "23079417815";
        String email = "new@digdir.no";
        String mobile = "12121212";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createEmptyUserDetailResource());

        clientService.updateKontaktinfo(fnr,email,mobile);

        Mockito.verify(kontaktregisterClient, times(1)).
                getUser(anyString());

        Mockito.verify(kontaktregisterClient, times(1)).
                createUser(userCaptor.capture());

        UserResource userResource = userCaptor.getValue();

        assertNull(userResource.getUuid());

        assertEquals(fnr, userResource.getSsn());
        assertEquals(email, userResource.getEmail());
        assertEquals(mobile, userResource.getMobile());

        assertTrue(email, userResource.getEmailVerifiedDate().after(setDateToYesterday()));
        assertTrue(email, userResource.getEmailLastUpdated().after(setDateToYesterday()));

        assertTrue(mobile, userResource.getMobileVerifiedDate().after(setDateToYesterday()));
        assertTrue(mobile, userResource.getMobileLastUpdated().after(setDateToYesterday()));
    }

    @Test
    void updateKontaktinfo() {
        String fnr = "23079417815";
        String email = "retrieved@digdir.no";
        String mobile = "22224444";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr,email,mobile));

        String newEmail = "updated@digdir.no";

        clientService.updateKontaktinfo(fnr,newEmail,mobile);

        Mockito.verify(kontaktregisterClient, times(1)).
                getUser(anyString());

        Mockito.verify(kontaktregisterClient, times(1)).
                updateUser(userCaptor.capture());

        UserResource userResource = userCaptor.getValue();

        assertNotNull(userResource.getUuid());

        assertEquals(fnr, userResource.getSsn());
        assertEquals(newEmail, userResource.getEmail());
        assertEquals(mobile, userResource.getMobile());

        assertTrue(newEmail, userResource.getEmailVerifiedDate().after(setDateToYesterday()));
        assertTrue(newEmail, userResource.getEmailLastUpdated().after(setDateToYesterday()));

        assertTrue(mobile, userResource.getMobileVerifiedDate().after(setDateToYesterday()));
        assertFalse(mobile, userResource.getMobileLastUpdated().after(setDateToYesterday()));
    }

    private UserDetailResource createUserDetailResource(String ssn, String email, String mobile) {

        UserResource userResource = new UserResource("uuid",
                ssn,
                email,
                mobile,
                null,
                setDateToYesterday(),
                setDateToYesterday(),
                setDateToYesterday(),
                setDateToYesterday(),
                setDateToYesterday(),
                null,
                false,
                false,
                null,
                null);
        return new UserDetailResource(userResource, null, null);
    }

    private Date setDateToYesterday(){
        return new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
    }

    private UserDetailResource createEmptyUserDetailResource() {
        return new UserDetailResource(null, null, null);
    }
}

package no.digdir.kontaktinfo.controller;

import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ContactInfoControllerTest {

    @Autowired
    ClientService clientService;

    @Autowired
    ContactInfoController contactInfoController;

    @MockBean
    private RestTemplate restTemplate;

    @Test
    public void checkUserIsMissingContactInfo() {
        String fnr = "23079417815";
        String email = null;
        String mobile = null;

        Mockito.when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class), anyString()))
                .thenReturn(new ResponseEntity(createUserDetailResource(fnr, email, mobile), null, HttpStatus.OK));

        PersonResource personResource = clientService.getPersonForFnr(fnr);

        String path = contactInfoController.getRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/create",path);
    }

    @Test
    public void checkUserIsNullContactInfo() {
        PersonResource personResource = null;
        String path = contactInfoController.getRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/create",path);
    }

    @Test
    public void checkUserIsNewContactInfo() {
        PersonResource personResource = new PersonResource();
        personResource.setNewUser(true);
        String path = contactInfoController.getRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/create",path);
    }

    @Test
    public void checkUserIsMissingEmailPast90days() {
        String fnr = "23079417815";
        String email = null;
        String mobile = "12121212";

        Mockito.when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class), anyString()))
                .thenReturn(new ResponseEntity(createUserDetailResource(fnr, email, mobile), null, HttpStatus.OK));

        PersonResource personResource = clientService.getPersonForFnr(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.getRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/createEmail",path);
    }

    @Test
    public void checkUserIsMissingMobilePast90days() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = null;

        Mockito.when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class), anyString()))
                .thenReturn(new ResponseEntity(createUserDetailResource(fnr, email, mobile), null, HttpStatus.OK));

        PersonResource personResource = clientService.getPersonForFnr(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.getRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/createMobile",path);
    }

    @Test
    public void checkUserShouldUpdatePast90days() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = "12121212";

        Mockito.when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class), anyString()))
                .thenReturn(new ResponseEntity(createUserDetailResource(fnr, email, mobile), null, HttpStatus.OK));

        PersonResource personResource = clientService.getPersonForFnr(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.getRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo",path);
    }

    @Test
    public void checkUserNoUpdateRedirectedBackToIdPorten() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = "12121212";

        Mockito.when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class), anyString()))
                .thenReturn(new ResponseEntity(createUserDetailResource(fnr, email, mobile), null, HttpStatus.OK));

        PersonResource personResource = clientService.getPersonForFnr(fnr);
        personResource.setShouldUpdateKontaktinfo(false);

        String path = contactInfoController.getRedirectPath(personResource);
        assertNull(path);
    }
    
    private UserDetailResource createUserDetailResource(String ssn, String email, String mobile) {
        UserResource userResource = new UserResource("uuid",
                ssn,
                email,
                mobile,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                false,
                false,
                null,
                null);
        return new UserDetailResource(userResource, null, null);
    }
}

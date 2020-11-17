package no.digdir.kontaktinfo.controller;

import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.integration.KontaktregisterClient;
import no.digdir.kontaktinfo.service.ClientService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ContactInfoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    ClientService clientService;

    @Autowired
    ContactInfoController contactInfoController;

    @MockBean
    private KontaktregisterClient kontaktregisterClient;

    @Test
    public void checkRedirectPathIfPersonResourceIsNull(){
        String fnr = "23079417815";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(null);

        String nextDestination = contactInfoController.getRedirectPath(fnr);
        assertNull(nextDestination);
    }

    @Test
    public void checkRedirectPathNewUser(){
        PersonResource personResource = new PersonResource();
        personResource.setNewUser(true);
        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/create",path);
    }

    @Test
    public void checkRedirectPathNoContactInfo(){
        String fnr = "23079417815";
        String email = null;
        String mobile = null;

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr,email,mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/create",path);
    }

    @Test
    public void checkRedirectPathTipEmail(){
        String fnr = "23079417815";
        String email = null;
        String mobile = "12121212";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr,email,mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/createEmail",path);
    }

    @Test
    public void checkRedirectPathTipMobile() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = null;

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr,email,mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo/createMobile",path);
    }

    @Test
    public void checkRedirectPathShouldUpdate() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = "12121212";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr,email,mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals("/idporten-bekreft-kontaktinfo",path);
    }

    @Test
    public void checkRedirectPathNoUpdate() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = "12121212";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr,email,mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setShouldUpdateKontaktinfo(false);

        String path = contactInfoController.buildRedirectPath(personResource);
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

    private PersonResource createPersonResource(String email, String mobile) {
        return PersonResource.builder().
                email(email).
                mobile(mobile).
                build();
    }
}

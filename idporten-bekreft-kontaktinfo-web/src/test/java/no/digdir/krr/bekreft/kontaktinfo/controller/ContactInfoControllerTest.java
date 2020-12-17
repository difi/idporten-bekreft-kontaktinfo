package no.digdir.krr.bekreft.kontaktinfo.controller;

import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.krr.bekreft.kontaktinfo.domain.PersonResource;
import no.digdir.krr.bekreft.kontaktinfo.integration.KontaktregisterClient;
import no.digdir.krr.bekreft.kontaktinfo.service.ClientService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import static no.digdir.krr.bekreft.kontaktinfo.controller.ContactInfoController.INGEN_ENDRING;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ContactInfoControllerTest {

    @Autowired
    ClientService clientService;
    @Autowired
    ContactInfoController contactInfoController;
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private KontaktregisterClient kontaktregisterClient;

    @Test
    public void checkContactInfoControllerEnabled() throws Exception {
        String fnr = "10101010101";
        String locale = "nb";
        String gotoParam = "http://digdir.no";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr, null, null));

        MvcResult mvcResult = mockMvc.perform(get("/api/user/" + fnr + "/confirm")
                .param("locale", locale)
                .param("goto", gotoParam)
                .with(csrf()))
                .andExpect(status().isFound())
                .andReturn();

        String location = (String) mvcResult.getResponse().getHeaderValue("Location");
        assertTrue(URLDecoder.decode(location, StandardCharsets.UTF_8.name()).contains(ContactInfoController.CREATE_PAGE));
        assertTrue(URLDecoder.decode(location, StandardCharsets.UTF_8.name()).contains(gotoParam));
    }

    @Test
    public void checkRedirectPathIfPersonResourceIsNull() {
        String fnr = "23079417815";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(null);

        String nextDestination = contactInfoController.getRedirectPath(fnr);
        assertEquals(INGEN_ENDRING, nextDestination);
    }

    @Test
    public void checkRedirectPathNewUser() {
        PersonResource personResource = new PersonResource();
        personResource.setNewUser(true);
        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals(ContactInfoController.CREATE_PAGE, path);
    }

    @Test
    public void checkRedirectPathNoContactInfo() {
        String fnr = "23079417815";
        String email = null;
        String mobile = null;

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr, email, mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals(ContactInfoController.CREATE_PAGE, path);
    }

    @Test
    public void checkRedirectPathTipEmail() {
        String fnr = "23079417815";
        String email = null;
        String mobile = "12121212";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr, email, mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals(ContactInfoController.CREATE_EMAIL_PAGE, path);
    }

    @Test
    public void checkRedirectPathTipMobile() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = null;

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr, email, mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals(ContactInfoController.CREATE_MOBILE_PAGE, path);
    }

    @Test
    public void checkRedirectPathShouldUpdate() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = "12121212";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr, email, mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setShouldUpdateKontaktinfo(true);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals(ContactInfoController.CONFIRM_PAGE, path);
    }

    @Test
    public void checkRedirectPathNoUpdate() {
        String fnr = "23079417815";
        String email = "mocking@digdir.no";
        String mobile = "12121212";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr, email, mobile));

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setShouldUpdateKontaktinfo(false);

        String path = contactInfoController.buildRedirectPath(personResource);
        assertEquals(INGEN_ENDRING, path);
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

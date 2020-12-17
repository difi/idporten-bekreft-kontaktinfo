package no.digdir.krr.bekreft.kontaktinfo.featureswitch;

import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.krr.bekreft.kontaktinfo.controller.ContactInfoController;
import no.digdir.krr.bekreft.kontaktinfo.integration.KontaktregisterClient;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.net.URLDecoder;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {"featureswitch.bekreft_kontaktinfo_enabled=false"})
public class FeatureSwitchTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private KontaktregisterClient kontaktregisterClient;

    @Value("${featureswitch.bekreft_kontaktinfo_enabled}")
    private Boolean bekreftKontaktinfoEnabled;

    @Test
    public void testPropertySourceWorking(){

        // test property source
        assertFalse(bekreftKontaktinfoEnabled);
    }

    @Test
    public void checkContactInfoControllerDisabled() throws Exception {
        String fnr = "10101010101";
        String locale = "nb";
        String gotoParam = "http://digdir.no";

        Mockito.when(kontaktregisterClient.getUser(anyString()))
                .thenReturn(createUserDetailResource(fnr,null,null));

        MvcResult mvcResult = mockMvc.perform(get("/api/user/"+fnr+"/confirm")
                .param("locale",locale)
                .param("goto",gotoParam)
                .with(csrf()))
                .andExpect(status().isInternalServerError())
                .andReturn();
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

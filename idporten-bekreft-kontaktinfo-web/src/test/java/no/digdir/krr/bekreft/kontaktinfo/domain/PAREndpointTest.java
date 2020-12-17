package no.digdir.krr.bekreft.kontaktinfo.domain;

import no.digdir.krr.bekreft.kontaktinfo.config.JwtConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.config.OpenIDConnectConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.controller.ContactInfoController;
import no.digdir.krr.bekreft.kontaktinfo.crypto.KeyProvider;
import no.digdir.krr.bekreft.kontaktinfo.crypto.KeyStoreProvider;
import no.digdir.krr.bekreft.kontaktinfo.rest.PAREndpoint;
import no.digdir.krr.bekreft.kontaktinfo.service.KontaktinfoCache;
import no.idporten.sdk.oidcserver.OpenIDConnectIntegration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(PAREndpoint.class)
public class PAREndpointTest {

    @MockBean
    ContactInfoController contactInfoController;
    @MockBean
    KontaktinfoCache kontaktinfoCache;
    @MockBean
    OpenIDConnectIntegration openIDConnectSdk;
    @MockBean
    OpenIDConnectConfigProvider openIDConnectConfigProvider;
    @MockBean
    JwtConfigProvider jwtConfigProvider;
    @MockBean
    KeyStoreProvider keyStoreProvider;
    @MockBean
    KeyProvider keyProvider;
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void feilUrlFinnesIkke() throws Exception {
        mockMvc.perform(get("/api/monkey"))
                .andExpect(status().isNotFound());
    }

}
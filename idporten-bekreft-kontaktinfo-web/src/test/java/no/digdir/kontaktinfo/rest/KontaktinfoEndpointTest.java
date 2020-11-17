package no.digdir.kontaktinfo.rest;

import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import no.digdir.kontaktinfo.service.KontaktinfoCache;
import no.digdir.kontaktinfo.service.KontaktinfoCacheTest;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.junit.Assert.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
public class KontaktinfoEndpointTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    ClientService clientService;

    @Autowired
    KontaktinfoCache kontaktinfoCache;

    String fnr = "23079410594";
    String email = "test@domain.com";
    String mobile = "95959595";

    @Test
    public void testPostUserAndResponse() throws Exception {
        PersonResource personResource = createPersonResource(fnr,email,mobile);
        String code = kontaktinfoCache.putPersonResource(personResource);
        personResource.setCode(code);

        MvcResult mvcResult = mockMvc.perform(post("/api/kontaktinfo")
                .content("{\"uuid\": \""+code+"\", \"email\": \"test@domain.com\", \"mobile\": \"22224444\"}")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        JSONObject response = new JSONObject(mvcResult.getResponse().getContentAsString());

        assertEquals(response.get("uuid"),personResource.getCode());
        assertNotNull(response.get("code"));
    }

    @Test
    public void testPostUserNotInCache() throws Exception {
        PersonResource personResource = createPersonResource(fnr,email,mobile);
        String code = UUID.randomUUID().toString();
        personResource.setCode(code);

        MvcResult mvcResult = mockMvc.perform(post("/api/kontaktinfo")
                .content("{\"uuid\": \""+code+"\", \"email\": \"test@domain.com\", \"mobile\": \"22224444\"}")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isForbidden())
                .andReturn();
    }

    private PersonResource createPersonResource(String fnr, String email, String mobile) {
        return PersonResource.builder().
                personIdentifikator(fnr).
                email(email).
                mobile(mobile).
                build();
    }
}

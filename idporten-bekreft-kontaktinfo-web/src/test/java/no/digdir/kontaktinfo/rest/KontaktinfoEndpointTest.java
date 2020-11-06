package no.digdir.kontaktinfo.rest;

import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
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

import static org.hamcrest.core.StringContains.containsString;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
public class KontaktinfoEndpointTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    ClientService clientService;

    String fnr = "23079410594";

    /*
    @Test
    public void testGetUser() throws Exception {
        String email = "new@email.com";
        String mobile = "22224444";
        when(clientService.getKontaktinfo(fnr)).thenReturn(createPersonResource(email, mobile));
        MvcResult mvcResult = mockMvc.perform(get("/api/kontaktinfo/" + fnr))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(email)))
                .andExpect(content().string(containsString(mobile)))
                .andReturn();
    }

     */

    @Test
    public void testPostUser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/api/kontaktinfo")
                .content("{\"fnr\": \"23079421936\", \"email\": \"noone@nowhere.com\", \"mobile\": \"22224444\"}")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    public void testPostUserWithEmptyMobile() throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/api/kontaktinfo")
                .content("{\"fnr\": \"23079421936\", \"email\": \"noone@nowhere.com\", \"mobile\": \"\"}")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();
    }

    private PersonResource createPersonResource(String email, String mobile) {
        return PersonResource.builder().
                email(email).
                mobile(mobile).
                build();
    }

}

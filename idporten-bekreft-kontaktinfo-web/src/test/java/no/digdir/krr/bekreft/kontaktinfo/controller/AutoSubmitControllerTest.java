package no.digdir.krr.bekreft.kontaktinfo.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.junit.Assert.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class AutoSubmitControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void checkAutoSubmitWorking() throws Exception {
        String gotoParam = "http://digdir.no";

        MvcResult mvcResult = mockMvc.perform(get("/api/autosubmit")
                .param("gotoParam",gotoParam)
                .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        String content = mvcResult.getResponse().getContentAsString();
        assertTrue(content.contains("<body onload=\"javascript:document.forms[0].submit()\">"));
        assertTrue(content.contains("<form target=\"_parent\" method=\"post\" action=\""+gotoParam+"\">"));
    }
}

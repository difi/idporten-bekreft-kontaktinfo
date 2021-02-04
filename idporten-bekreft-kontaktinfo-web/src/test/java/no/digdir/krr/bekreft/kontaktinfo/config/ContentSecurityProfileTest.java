package no.digdir.krr.bekreft.kontaktinfo.config;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ContentSecurityProfileTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @Ignore
    public void checkDefaultContentSecurityPolicyIsPresent() throws Exception {
       mockMvc.perform(get("/"))
                .andExpect(header().string("Content-Security-Policy", "default-src 'self'; report-uri /csp-report-endpoint"));
    }
}

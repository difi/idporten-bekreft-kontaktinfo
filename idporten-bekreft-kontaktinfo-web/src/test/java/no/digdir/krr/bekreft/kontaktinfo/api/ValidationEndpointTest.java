package no.digdir.krr.bekreft.kontaktinfo.api;

import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
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

@SpringBootTest
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
public class ValidationEndpointTest {
    @Autowired
    private MockMvc mockMvc;

    private static final String MOBILE = "mobile";
    private static final String EMAIL = "email";

    @Test
    public void testValidateEmailEndpoint() throws Exception {
        assertTrue(validate(EMAIL,"test@domain.com"));
        assertTrue(validate(EMAIL, "test.sub@domain.sub.com"));

        assertFalse(validate(EMAIL,"test@-domain.com"));
        assertFalse(validate(EMAIL, "testdomain.com"));
        assertFalse(validate(EMAIL,"test@domaindotcom"));
        assertFalse(validate(EMAIL,"@domain.com"));
    }

    @Test
    public void testValidateMobileEndpoint() throws Exception {
        assertTrue("starting with 4",validate(MOBILE,"45127723"));
        assertTrue("starting with 9",validate(MOBILE,"95127723"));
        assertTrue("contains +47",validate(MOBILE,"+4795127723"));
        assertTrue("contains 0047",validate(MOBILE,"004795127723"));
        assertTrue("9 digits",validate(MOBILE, "121212121"));

        assertFalse("contains letters",validate(MOBILE,"XX127723")); // letters
        assertFalse("less than 8 digits",validate(MOBILE,"9512772"));
        assertFalse("does not start with 4 or 9", validate(MOBILE,"12121212"));
    }

    private Boolean validate(String type,String value) throws Exception {
        MvcResult mvcResult = mockMvc.perform(get("/api/validate/"+type+"/" + value)
                .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        JSONObject response = new JSONObject(mvcResult.getResponse().getContentAsString());
        return (Boolean) response.get("valid");
    }
}

package no.digdir.kontaktinfo.rest;

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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
        assertTrue(validate(MOBILE,"45127723")); // regular starting with 4
        assertTrue(validate(MOBILE,"95127723")); // regular starting with 9
        assertTrue(validate(MOBILE,"+4795127723")); // +47
        assertTrue(validate(MOBILE,"004785127723")); // 0047

        assertFalse(validate(MOBILE,"XX127723")); // letters
        assertFalse(validate(MOBILE,"9512772")); // less than 8 digits

        // this is allowed but should not be
        //assertFalse(validateMobileNumber("12121212")); // does not start with 4 or 9
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

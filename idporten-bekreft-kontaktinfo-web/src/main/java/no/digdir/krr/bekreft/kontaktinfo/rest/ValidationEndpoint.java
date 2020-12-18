package no.digdir.krr.bekreft.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.difi.validation.EmailValidator;
import no.difi.validation.MobileValidator;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/validate")
@RequiredArgsConstructor
@Slf4j
public class ValidationEndpoint {

    private static String jsonResponse(Boolean isValid) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("valid", isValid);
        return jsonObject.toString();
    }

    @GetMapping("/mobile/{mobileNumber}")
    public String validateMobile(@PathVariable String mobileNumber) throws JSONException {
        return jsonResponse(MobileValidator.isValid(mobileNumber));
    }

    @GetMapping("/email/{email}")
    public String validateEmail(@PathVariable String email) throws JSONException {
        return jsonResponse(EmailValidator.isValid(email));
    }
}
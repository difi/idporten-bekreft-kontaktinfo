package no.digdir.krr.bekreft.kontaktinfo.integration;

import no.idporten.sdk.oidcserver.OAuth2Exception;
import no.idporten.sdk.oidcserver.protocol.PushedAuthorizationRequest;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static no.digdir.krr.bekreft.kontaktinfo.controller.ContactInfoController.DIGITALCONTACTREGISTER_PID;

public class OpenIDConnectKontaktInfoTest {

    @Test(expected = OAuth2Exception.class)
    public void validateMissingPid() {
        PushedAuthorizationRequest authorizationRequest = new PushedAuthorizationRequest(new MockHttpServletRequest());
        OpenIDConnectKontaktInfo.validatePid(authorizationRequest);
    }

    @Test
    public void validateValidPid() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter(DIGITALCONTACTREGISTER_PID, "24079410604");
        PushedAuthorizationRequest authorizationRequest = new PushedAuthorizationRequest(request);
        OpenIDConnectKontaktInfo.validatePid(authorizationRequest);
    }

    @Test(expected = OAuth2Exception.class)
    public void validateInvalidPid() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter(DIGITALCONTACTREGISTER_PID, "123456789");
        PushedAuthorizationRequest authorizationRequest = new PushedAuthorizationRequest(request);
        OpenIDConnectKontaktInfo.validatePid(authorizationRequest);
    }
}
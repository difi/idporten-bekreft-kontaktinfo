package no.digdir.krr.bekreft.kontaktinfo.integration;

import no.difi.validation.SsnValidator;
import no.digdir.krr.bekreft.kontaktinfo.config.StringConstants;
import no.idporten.sdk.oidcserver.OAuth2Exception;
import no.idporten.sdk.oidcserver.OpenIDConnectIntegrationBase;
import no.idporten.sdk.oidcserver.client.ClientMetadata;
import no.idporten.sdk.oidcserver.config.OpenIDConnectSdkConfiguration;
import no.idporten.sdk.oidcserver.protocol.PushedAuthorizationRequest;
import org.springframework.http.HttpStatus;

import static org.apache.commons.lang3.StringUtils.isBlank;

public class OpenIDConnectKontaktInfo extends OpenIDConnectIntegrationBase {

    public OpenIDConnectKontaktInfo(OpenIDConnectSdkConfiguration sdkConfiguration) {
        super(sdkConfiguration);
    }

    static void validatePid(PushedAuthorizationRequest authorizationRequest) {
        String pid = authorizationRequest.getParameter(StringConstants.DIGITALCONTACTREGISTER_PID);
        if (isBlank(pid)) {
            throw new OAuth2Exception(
                    OAuth2Exception.INVALID_REQUEST,
                    "Missing parameter '" + StringConstants.DIGITALCONTACTREGISTER_PID + "'.",
                    HttpStatus.BAD_REQUEST.value());
        } else {
            if (!SsnValidator.isValid(pid)) {
                throw new OAuth2Exception(
                        OAuth2Exception.INVALID_REQUEST,
                        "Parameter '" + StringConstants.DIGITALCONTACTREGISTER_PID + "' does not validate.",
                        HttpStatus.BAD_REQUEST.value());
            }
        }
    }

    @Override
    public void validate(PushedAuthorizationRequest authorizationRequest, ClientMetadata clientMetadata) {
        super.validate(authorizationRequest, clientMetadata);

        validatePid(authorizationRequest);
    }

}

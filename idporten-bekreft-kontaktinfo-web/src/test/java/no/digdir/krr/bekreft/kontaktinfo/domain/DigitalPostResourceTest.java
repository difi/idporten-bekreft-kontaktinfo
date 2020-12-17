package no.digdir.krr.bekreft.kontaktinfo.domain;

import no.difi.kontaktregister.dto.PostboxOperatorResource;
import no.difi.kontaktregister.dto.PostboxResource;
import org.junit.Test;

import java.util.Date;

import static org.junit.Assert.assertEquals;

public class DigitalPostResourceTest {

    @Test
    public void fromPostboxResource() {
        String operatorName = "operator name";
        String address = "address";
        PostboxOperatorResource postboxOperator = new PostboxOperatorResource("99999999999", operatorName, null);
        PostboxResource postboxResource = new PostboxResource("uid", address, true, new Date(), new Date(), null, postboxOperator);
        DigitalPostResource digitalPostResource = DigitalPostResource.fromPostboxResource(postboxResource);

        assertEquals("Postkasseadresse skal bevares", address, digitalPostResource.postkasseadresse);
        assertEquals("Postkasseleverandør skal bevares", operatorName, digitalPostResource.postkasseleverandoernavn);
    }
}
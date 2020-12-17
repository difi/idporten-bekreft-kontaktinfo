package no.digdir.krr.bekreft.kontaktinfo.domain;

import no.difi.kontaktregister.dto.PostboxOperatorResource;
import no.difi.kontaktregister.dto.PostboxResource;
import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import org.junit.Test;

import java.util.Collections;
import java.util.Date;

import static org.junit.Assert.assertEquals;

public class PersonResourceTest {

    @Test
    public void fromUserDetailResource() {
        String ssn = "123";
        String email = "email@example.com";
        String mobile = "44444444";
        UserResource userResource = new UserResource(ssn, email, mobile);
        String address = "digitalpostadresse";
        boolean active = true;
        PostboxOperatorResource postboxOperator = new PostboxOperatorResource("99999999999", "operatørnavn", null);
        PostboxResource postboxResource = new PostboxResource("uuid", address, active, new Date(), new Date(), null, postboxOperator);
        UserDetailResource userDetailResource = new UserDetailResource(userResource, Collections.singletonList(postboxResource), postboxResource);

        PersonResource personResource = PersonResource.fromUserDetailResource(userDetailResource, 0);

        assertEquals("Fnr. skal bevares", ssn, personResource.getPersonIdentifikator());
        assertEquals("Digital operatør skal bevares", postboxOperator.getName(), personResource.getDigitalPost().postkasseleverandoernavn);
    }
}
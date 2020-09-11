package no.digdir.kontaktinfo.service;

import no.difi.kontaktregister.dto.UserDetailResource;
import no.difi.kontaktregister.dto.UserResource;
import no.digdir.kontaktinfo.domain.PersonResource;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;

@RunWith(SpringRunner.class)
@SpringBootTest
class ClientServiceTest {

    @Autowired
    private ClientService clientService;

    @MockBean
    private RestTemplate restTemplate;

    @Captor
    ArgumentCaptor<HttpEntity<UserResource>> userCaptor;

    @Captor
    ArgumentCaptor<HttpEntity<Object>> headerCaptor;

    private static Date mobileVerifiedDate;
    private static Date mobileLastUpdated;
    private static Date emailVerifiedDate;
    private static Date emailLastUpdated;
    private static Date userCreated;
    private static Date userLastUpdated;

    @Before
    public void setUp() {
        DateFormat df = new SimpleDateFormat("dd-MM-yyyy");
        try {
            mobileVerifiedDate = df.parse("12-02-2020");
            mobileLastUpdated = df.parse("12-02-2020");
            emailVerifiedDate = df.parse("12-02-2020");
            emailLastUpdated = df.parse("12-02-2020");
        } catch (ParseException e) {
            //Unlikely to fail
        }
    }

    @Test
    void getPersonForFnr() {
        String fnr = "23079417815";
        String email = "retrieved@digdir.no";
        String mobile = "22224444";
        Mockito.when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class), anyString()))
                .thenReturn(new ResponseEntity(createUserDetailResource(fnr, email, mobile), null, HttpStatus.OK));
        PersonResource person = clientService.getPersonForFnr(fnr);
        assertEquals(person.getPersonIdentifikator(), fnr);
        assertEquals(person.getEmail(), email);
        assertEquals(person.getMobile(), mobile);
    }

    @Test
    void updateContactInfo() {
        String fnr = "23079417815";
        String email = "retrieved@digdir.no";
        String mobile = "22224444";
        String newEmail = "updated@digdir.no";
        String newMobile = "22224445";
        Date thisMorning = java.sql.Timestamp.valueOf(LocalDate.now().atStartOfDay());
        String getUrl = "http://eid-systest-admin01.dmz.local:10002/kontaktinfo-backend/kontaktregister/users/userDetail?ssn={ssn}";
        String putUrl = "http://eid-systest-admin01.dmz.local:10002/kontaktinfo-backend/kontaktregister/users/{uuid}";
        Mockito.when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class), anyString()))
                .thenReturn(new ResponseEntity(createUserDetailResource(fnr, email, mobile), null, HttpStatus.OK));
        clientService.updateContactInfo(fnr, newEmail, newMobile);
        Mockito.verify(restTemplate, times(2)).exchange(anyString(), any(HttpMethod.class), userCaptor.capture(), any(Class.class), anyString());
        UserResource userResource = userCaptor.getAllValues().get(1).getBody();
        assertEquals(fnr, userResource.getSsn());
        assertEquals(newEmail, userResource.getEmail());
        assertEquals(newMobile, userResource.getMobile());
        assertEquals(newMobile, userResource.getMobile());
        assertTrue(newMobile, userResource.getEmailVerifiedDate().after(thisMorning));
        assertTrue(newMobile, userResource.getEmailLastUpdated().after(thisMorning));
        assertTrue(newMobile, userResource.getMobileVerifiedDate().after(thisMorning));
        assertTrue(newMobile, userResource.getMobileLastUpdated().after(thisMorning));
    }

    private UserDetailResource createUserDetailResource(String ssn, String email, String mobile) {
        UserResource userResource = new UserResource("uuid",
                ssn,
                email,
                mobile,
                null,
                mobileVerifiedDate,
                mobileLastUpdated,
                emailVerifiedDate,
                emailLastUpdated,
                userCreated,
                userLastUpdated,
                false,
                false,
                null,
                null);
        return new UserDetailResource(userResource, null, null);
    }
}
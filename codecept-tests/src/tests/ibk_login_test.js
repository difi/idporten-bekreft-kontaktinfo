Feature('ibk login test');

Before(({ I }) => {

    I.resetLastUpdatedOfUser();

    I.amOnPage(process.env.IBK_HOST);
    I.seeInCurrentUrl('/idporten-oidc-client/');
    I.seeInTitle("ID-porten OpenID Connect klient");
});

After(({ I }) => {
    I.logoutOidcClient();
});


Scenario('attempts login through oidc-client', async ({ I, oidcClientPage }) => {

    oidcClientPage.selectClientId(process.env.IBK_CLIENT_ID);
    oidcClientPage.clickLogin();

    I.loginWithMinID();
    I.click('#continueConfirmBtn');


    I.click('#continuebtn');

    I.click('#get-tokens');
});
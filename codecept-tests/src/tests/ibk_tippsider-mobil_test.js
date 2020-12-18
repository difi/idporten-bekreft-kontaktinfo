Feature('ibk tippsider for uten mobil addressa test');

Before(({ I }) => {

    I.amOnPage(process.env.IBK_HOST);
    I.seeInCurrentUrl('/idporten-oidc-client/');
    I.seeInTitle("ID-porten OpenID Connect klient");
});

After(({ I }) => {
    I.logoutOidcClient();
    I.resetUser();
});


Scenario('IBK tippsider for uten epost', async ({ I, oidcClientPage }) => {

    oidcClientPage.selectClientId(process.env.IBK_CLIENT_ID);
    oidcClientPage.clickLogin();
    I.resetUser();
    I.insertUserWithoutMobile();
    I.resetLastUpdatedOfUser();
    I.loginWithMinID();
    I.createKRRWithoutMobile();
    I.click('#get-tokens');



});
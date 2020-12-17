Feature('ibk tippsider for uten epost addressa test');

Before(({ I }) => {
    I.resetUser();
    I.insertUserWithoutEmail();
    I.resetLastUpdatedOfUser();
    I.amOnPage(process.env.IBK_HOST);
    I.seeInCurrentUrl('/idporten-oidc-client/');
    I.seeInTitle("ID-porten OpenID Connect klient");
});

After(({ I }) => {
    I.logoutOidcClient();
});


Scenario('IBK tippsider for uten epost', async ({ I, oidcClientPage }) => {

    oidcClientPage.selectClientId(process.env.IBK_CLIENT_ID);
    oidcClientPage.clickLogin();
    I.loginWithMinID();
    I.createKRRWithoutEmail();

    I.click('#get-tokens');


});
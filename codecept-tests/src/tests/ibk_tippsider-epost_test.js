Feature('ibk tippsider for uten epost addressa test');

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
    I.waitForNavigation();
    I.resetUser();
    I.waitForNavigation();
    I.insertUserWithoutEmail();
    I.waitForNavigation();
    I.resetLastUpdatedOfUser();

    I.loginWithMinID();
    I.waitForNavigation();
    I.createKRRWithoutEmail();
    I.waitForNavigation();
    I.click('#get-tokens');


});
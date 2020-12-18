Feature('IBK opprette KRR bruker');

Before(({ I }) => {
    I.resetUser();
    I.amOnPage(process.env.IBK_HOST);
    I.seeInCurrentUrl('/idporten-oidc-client/');
    I.seeInTitle("ID-porten OpenID Connect klient");
});

After(({ I }) => {
    I.logoutOidcClient();
    I.resetUser();
});


Scenario('OPPRETT KONTAKTINFORMASJON', async ({ I, oidcClientPage }) => {

    oidcClientPage.selectClientId(process.env.IBK_CLIENT_ID);
    oidcClientPage.clickLogin();

    I.loginWithMinID();
    I.createKRR();
    I.waitForNavigation();
    I.click('#get-tokens');



});
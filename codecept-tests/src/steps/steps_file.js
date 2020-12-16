
module.exports = function() {
  return actor({

    logoutOidcClient: function () {
      this.click('#logout-link');
      this.click('#logout');
      this.waitForNavigation();
    },

    loginWithMinID() {
      this.click('#MinIDChain');

      this.fillField('#input_USERNAME_IDPORTEN', process.env.IBK_USERNAME);
      this.fillField('#input_PASSWORD_IDPORTEN', process.env.IBK_PASSWORD);
      this.click('#nextbtn');
      
      this.see("PIN-KODE");
      this.fillField('#input_PINCODE1_IDPORTEN', process.env.IBK_CODE);
      this.click('#nextbtn');

      //this.see("Informasjonen nedenfor lagres i et felles kontaktregister som stat og kommune skal bruke nÃ¥r de kontakter deg");

      // may ask to CREATE kontaktinfo
      // this.tryTo(() => I.click('//*[@id="confirmContactinfo"]/div[5]/button')); // id missing - using xpath
     // this.tryTo(() => I.click('//*[@id="idporten.inputbutton.CONTINUE"]'));

      // may ask to CONFIRM kontaktinfo



    },
    createKRR(){
      this.see('DINE KONTAKTOPPLYSNINGER');
      this.see('OPPRETT KONTAKTINFORMASJON');
      this.see('Informasjonen nedenfor lagres i et felles kontaktregister som stat og kommune skal bruke når de kontakter deg.');
      this.see('Du kan velge å gå videre uten å legge inn kontaktopplysninger.');

      this.fillField('#idporten.input.CONTACTINFO_EMAIL', process.env.IBK_USERNAME+'@digdir.no');
      this.fillField('#idporten.inputrepeat.CONTACTINFO_EMAIL', process.env.IBK_USERNAME+'@digdir.no');
      this.fillField('#idporten.input.CONTACTINFO_MOBILE', '+4799999999');
      this.fillField('#idporten.inputrepeat.CONTACTINFO_MOBILE', '+4799999999');
      this.fillField('#input_PASSWORD_IDPORTEN', process.env.IBK_PASSWORD);
      this.click('Neste');
    },
    createKRRWithoutEmail(){
      this.see('DINE KONTAKTOPPLYSNINGER');
      this.see('Informasjonen nedenfor lagres i et felles kontaktregister som stat og kommune skal bruke når de kontakter deg.');
      I.click('#idporten.inputbutton.CONTINUE_CONFIRM');
    },
    createKRRWithoutMobile(){
      this.see('DINE KONTAKTOPPLYSNINGER');
      this.see('OPPRETT KONTAKTINFORMASJON');
      this.see('Informasjonen nedenfor lagres i et felles kontaktregister som stat og kommune skal bruke når de kontakter deg.');
      I.click('#idporten.inputbutton.CONTINUE_CONFIRM');
    },
  });
};

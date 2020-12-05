
module.exports = function() {
  return actor({

    logoutOidcClient: function () {
      this.click('Logg ut');
      this.click('Start utlogging');
      this.waitForNavigation();
    },

    loginWithMinID() {
      this.click('#MinIDChain');

      this.fillField('#input_USERNAME_IDPORTEN', process.env.IBK_USERNAME);
      this.fillField('#input_PASSWORD_IDPORTEN', process.env.IBK_PASSWORD);
      this.click('#nextbtn');
      
      this.see("PIN-KODE")
      this.fillField('#input_PINCODE1_IDPORTEN', process.env.IBK_CODE);
      this.click('#nextbtn');

      // may ask to CREATE kontaktinfo
      // this.tryTo(() => I.click('//*[@id="confirmContactinfo"]/div[5]/button')); // id missing - using xpath
      this.tryTo(() => I.click('//*[@id="idporten.inputbutton.CONTINUE"]'));

      // may ask to CONFIRM kontaktinfo
      this.tryTo(() => I.click('//*[@id="idporten.inputbutton.CONTINUE_CONFIRM"]'));

    },

  });
};

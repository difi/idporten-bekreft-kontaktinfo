const { I } = inject();

module.exports = {

    selectClientId(client_id) {
        I.selectOption('select#client_id', client_id);
    },

    clickLogin() {
      I.click('#login');
      I.waitForNavigation();
    },


};

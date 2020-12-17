const Helper = require('@codeceptjs/helper');
const mysql = require('mysql');
const { uuid } = require('uuidv4');

// https://codecept.io/helpers/
// https://github.com/mysqljs/mysql

class MySQLHelper extends Helper {

  _init() {
    console.log("*** INIT MYSQL at: " + process.env.IBK_DB_URL);
    this.conn = mysql.createConnection(process.env.IBK_DB_URL);
    this.conn.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
      console.log('connected as id ' + this.conn.threadId);
    });

  }

  _finishTest() {
    console.log("*** CLOSE MYSQL");
    this.conn.end(function(err) {
      // The connection is terminated now
    });
  }


  _beforeSuite() {

    this.conn.query("delete from user where ssn='24079497513'", function (err, result) {
      if (err) throw err;
      console.log("*** _beforeSuite-> delete from user where ssn='24079497513'", result);
    });

  }

  _afterSuite() {
    this.conn.query("delete from user where ssn='24079497513'", function (err, result) {
      if (err) throw err;
      console.log("*** _afterSuite --> delete from user where ssn='24079497513'", result);
    });
  }


  resetLastUpdatedOfUser() {
    /*
    PREFERRED_LANGUAGE_LAST_UPDATED
    MOBILE_LAST_UPDATED
    EMAIL_LAST_UPDATED
    RESERVED_LAST_UPDATED
     */

    this.conn.query("update user set last_updated = str_to_date('2018-03-01', '%Y-%m-%d'), PREFERRED_LANGUAGE_LAST_UPDATED = str_to_date('2018-03-01', '%Y-%m-%d'),  MOBILE_LAST_UPDATED = str_to_date('2018-03-01', '%Y-%m-%d') where ssn='24079497513'", function (err, result) {
      if (err) throw err;
      console.log("update user where ssn = '24079497513'",result);
    });
    this.conn.query("select * from user where ssn = '24079497513'", function (err, result) {
      if (err) throw err;
      console.log("*** select * from user where ssn ='24079497513' ", result);
    });
  }

  resetUser() {
    /*
  Delete User from KRR
     */

    this.conn.query("delete from user where ssn='24079497513'", function (err, result) {
      if (err) throw err;
      console.log("*** resetUser --> delete from user where ssn='24079497513'", result);
    });
  }

  insertUserWithoutMobile(){
    this.conn.query("insert into user (uuid, ssn, email, mobile) values(uuid(), '24079497513','24079497513-test@digdir.no','')", function (err, result) {
      if (err) throw err;
      console.log("*** insertUserWithoutMobile --> insert into user (ssn) values('24079497513')", result);
    });
  }
  insertUserWithoutEmail(){
    this.conn.query("insert into user (uuid, ssn, email, mobile) values(uuid(), '24079497513','','+4799999999')", function (err, result) {
      if (err) throw err;
      console.log("*** insertUserWithoutEmail --> insert into user (ssn) values('24079497513')", result);
    });
  }
  insertUser(){
    this.conn.query("insert into user (uuid, ssn, email, mobile) values(uuid(), '24079497513','24079497513-test@digdir.no','+4799999999')", function (err, result) {
      if (err) throw err;
      console.log("*** insertUserWithoutEmail --> insert into user (ssn) values('24079497513')", result);
    });
  }
}

module.exports = MySQLHelper;

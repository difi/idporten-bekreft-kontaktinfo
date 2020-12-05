/// <reference types='codeceptjs' />
type steps_file = typeof import('./src/steps/steps_file.js');
type oidcClientPage = typeof import('./src/pages/oidcClientPage.js');
type AssertWrapper = import('codeceptjs-assert');
type BankIdHelper = import('./src/helpers/bankid_helper.js');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, oidcClientPage: oidcClientPage }
  interface Methods extends Puppeteer, AssertWrapper, BankIdHelper {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}

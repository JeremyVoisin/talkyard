/// <reference path="../test-types.ts"/>

import * as _ from 'lodash';
import assert = require('assert');
import server = require('../utils/server');
import utils = require('../utils/utils');
import { TyE2eTestBrowser } from '../utils/pages-for';
import settings = require('../utils/settings');
import make = require('../utils/make');
import logAndDie = require('../utils/log-and-die');
import c = require('../test-constants');

let browser: TyE2eTestBrowser;

let everyone;
let owen;
let owensBrowser: TyE2eTestBrowser;
let maria;
let mariasBrowser: TyE2eTestBrowser;

let idAddress: IdAddress;
let forumTitle = "(Dis)Allow Signup Forum";


describe("(dis)allow signup:", () => {

  it("initialize people", () => {
    browser = new TyE2eTestBrowser(wdioBrowser);
    everyone = browser;
    owen = make.memberOwenOwner();
    owensBrowser = browser;
    maria = make.memberMaria();
    mariasBrowser = browser;
  });

  it("import a site", () => {
    let site: SiteData = make.forumOwnedByOwen('no-signup', { title: forumTitle });
    site.settings.allowSignup = false;
    site.members.push(maria);
    idAddress = server.importSiteData(site);
  });

  it("Member Maria has an account, so she can login", () => {
    mariasBrowser.go(idAddress.origin);
    mariasBrowser.complex.loginWithPasswordViaTopbar(maria);
    mariasBrowser.disableRateLimits();
  });

  it("... but she cannot send invites, because signups disabled", () => {
    // TESTS_MISSING and not included in run-e2e-test.sh
  });

  it("... Maria leaves", () => {
    mariasBrowser.topbar.clickLogout();
  });

  it("A stranger sees no signup button", () => {
    // ...
  });

  it("... and in the login dialog, there's no 'create account instead' link", () => {
    // ...
  });

  it("An invite sent a while ago, by Maria, no longer works", () => {
  });

  it("Owen already has an account, he can login", () => {
    owensBrowser.complex.loginWithPasswordViaTopbar(owen);
  });


  /* This gets too complicated:

  it("?? ... and he can send invites, although signups disabled, because he's admin", () => {
    // ...
  });

  it("?? Michael got an invite from Owen. He can accept it", () => {
    // ...
  });

  it("?? But an old invite sent long a go, by a non-admin, doesn't work", () => {
    // ...
  }); */

});


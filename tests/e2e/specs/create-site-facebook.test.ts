/// <reference path="../test-types.ts"/>

import _ = require('lodash');
import assert = require('assert');
import server = require('../utils/server');
import utils = require('../utils/utils');
import { TyE2eTestBrowser } from '../utils/pages-for';
import settings = require('../utils/settings');
import logAndDie = require('../utils/log-and-die');
import createTestData = require('./create-site-impl');
const logUnusual = logAndDie.logUnusual, die = logAndDie.die, dieIf = logAndDie.dieIf;
const logMessage = logAndDie.logMessage;

let browser: TyE2eTestBrowser;


describe('create-site-facebook  @createsite @login @facebook  TyT8KA9AW3', () => {

  if (!settings.include3rdPartyDependentTests) {
    console.log("Skipping this spec; no 3rd party login credentials specified.");
    return;
  }

  it('initialize', () => {
    browser = new TyE2eTestBrowser(wdioBrowser);
  });

  it('can create a new site as a Facebook user, when not logged in to FB', () => {
    makeForumWithFacebookAdminAccount({ alreadyLoggedIn: false });
  });

  it('can actually use the FB admin account to create stuff', () => {
    browser.complex.createAndSaveTopic({ title: "Facebook topic title", body: "Body" });
    browser.topbar.clickLogout(); // (6HRWJ3)
  });

  it('can create a new site as Facebook user, when already logged in to FB', () => {
    // Now we're logged in already, so the Facebook login flow is / might-be slightly different.
    makeForumWithFacebookAdminAccount({ alreadyLoggedIn: true });
    browser.topbar.clickLogout(); // (6HRWJ3)
  });

  function makeForumWithFacebookAdminAccount(ps: { alreadyLoggedIn: boolean }) {
    const data = createTestData({
      newSiteOwner: NewSiteOwnerType.FacebookAccount,
      alreadyLoggedInAtIdProvider: ps.alreadyLoggedIn,
    });
    console.log("Create new site:");
    browser.createNewSite(data);
    console.log("Create forum:");
    browser.createSomething.createForum("Facebook Forum Title");
  }

});


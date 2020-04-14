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

const newMembersEmail = 'e2e-test--mia@example.com';
const newMembersTopicTitle = 'newMembersTopicTitle';
const newMembersTopicText = 'newMembersTopicText';

describe('create-site-gmail  @createsite  @login @gmail TyT7KKTEHS24', () => {

  if (!settings.include3rdPartyDependentTests) {
    console.log("Skipping this spec; no 3rd party login credentials specified.");
    return;
  }

  it('initialize', () => {
    browser = new TyE2eTestBrowser(wdioBrowser);
  });

  it('can create a new site as a Gmail user, when not logged in to Gmail', () => {
    makeForumWithGmailAdminAccount({ alreadyLoggedIn: false });
  });

  it('can actually use the Gmail admin account to create stuff', () => {
    browser.complex.createAndSaveTopic({ title: "Gmail topic title", body: "Body" });
    browser.topbar.clickLogout(); // (6HRWJ3)
  });

  // This is for OpenAuth created users. [7LERTA1]
  //describe('owner gets notifications about new topics (because is owner)', () => {  'describe' —> ignored
    it('a new member signs up', () => {
      browser.disableRateLimits();
      browser.complex.signUpAsMemberViaTopbar({
          emailAddress: newMembersEmail, username: 'Mia', password: 'public1122' });
    });
    it('verifies hens email address', () => {
      const siteId = browser.getSiteId();
      const link = server.getLastVerifyEmailAddressLinkEmailedTo(siteId, newMembersEmail, browser);
      browser.go2(link);
    });
    it('posts a topic', () => {
      browser.go2('/');
      browser.complex.createAndSaveTopic({ title: newMembersTopicTitle, body: newMembersTopicText });
    });
    it('the owner gets an email notification', () => {
      const siteId = browser.getSiteId();
      server.waitUntilLastEmailMatches(
          siteId, settings.gmailEmail, [newMembersTopicTitle, newMembersTopicText], browser);
      browser.topbar.clickLogout(); // (6HRWJ3)
    });
  //});

  it('can create a new site as a Gmail user, when already logged in to Gmail', () => {
    // Now we're logged in already, so the Gmail login flow is / might-be slightly different.
    makeForumWithGmailAdminAccount({ alreadyLoggedIn: true });
    browser.topbar.clickLogout(); // (6HRWJ3)
  });

  function makeForumWithGmailAdminAccount(ps: { alreadyLoggedIn: boolean }) {
    const data = createTestData({
      newSiteOwner: NewSiteOwnerType.GmailAccount,
      alreadyLoggedInAtIdProvider: ps.alreadyLoggedIn,
    });
    console.log("Create new site:");
    browser.createNewSite(data);
    console.log("Create forum:");
    browser.createSomething.createForum("Gmail Forum Title");
  }

});


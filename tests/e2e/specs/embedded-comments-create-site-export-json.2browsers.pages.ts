/// <reference path="../test-types.ts"/>

import { TyE2eTestBrowser } from '../utils/pages-for';

const slugs = {
  threeRepliesPageSlug: 'impexp-three-replies',
  replyWithImagePageSlug: 'impexp-reply-w-image',
  onlyLikeVotePageSlug: 'impexp-like-vote',
  onlySubscrNotfsPageSlug: 'impexp-subscr-notfs',
  guestReplyPageSlug: 'impexp-guest-reply',
};

const texts = {
  mariasReplyOne: 'mariasReplyOne',
  mariasReplyTwoWithImage: 'mariasReplyTwoWithImage',
  michaelsReply: 'michaelsReply',
  owensReplyMentionsMariaMichael: 'owensReplyMentionsMariaMichael @maria @michael',
  guestsReply: 'guestsReply',
  guestsName: 'Garbo Guest',
  guestsEmail: 'e2e-garboguest@x.co',
};

function createEmbeddingPages(browser) {
  const mkPage = browser.adminArea.settings.embedded.createSaveEmbeddingPage;
  mkPage({ urlPath: slugs.threeRepliesPageSlug });
  mkPage({ urlPath: slugs.replyWithImagePageSlug });
  mkPage({ urlPath: slugs.onlyLikeVotePageSlug });
  mkPage({ urlPath: slugs.onlySubscrNotfsPageSlug });
  mkPage({ urlPath: slugs.guestReplyPageSlug });
}


export {
  slugs,
  texts,
  createEmbeddingPages,
}

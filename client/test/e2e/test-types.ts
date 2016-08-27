/// <reference path="../../app/model.ts"/>
/// <reference path="../../app/constants.ts" />


interface TestSettings {
  debug: boolean;
  secure: boolean;
  host: string;
  scheme: string;
  testLocalHostnamePrefix: string;
  testEmailAddressPrefix: string;
  e2eTestPassword: string;
  forbiddenPassword: string;
  mainSiteOrigin: string;
  newSiteDomain: string;
  waitforTimeout: string;
  debugAfterwards: boolean;
  skip3rdPartyDependentTests?: boolean;
  grep: string;
  only: string;
  browserName: string;
  gmailEmail?: string;
  gmailPassword?: string;
  facebookAdminPassword?: string;
  facebookAdminEmail?: string;
  facebookUserPassword?: string;
  facebookUserEmail?: string;
}


interface SiteData {
  meta: SiteMeta;
  settings: any;
  groups: any;
  members: Member[];
  identities: any;
  guests: TestGuest[];
  blocks: any;
  invites: any;
  categories: TestCategory[];
  pages: Page[];
  pagePaths: PagePathWithId[];
  posts: TestPost[];
  emailsOut: any;
  notifications: any;
  uploads: any;
  auditLog: any;
  reviewTasks: any;
}


interface SiteMeta {
  id?: string;
  localHostname: string;
  creatorEmailAddress: string;
  status: SiteStatus,
  createdAtMs: number,
}


interface Member {
  id: number;
  username: string;
  fullName: string;
  createdAtMs: number;
  emailAddress: string;
  emailVerifiedAtMs?: number;
  passwordHash: string;
  isOwner?: boolean;
  isAdmin?: boolean;
  isModerator?: boolean;
}


interface TestGuest {  // try to rename to Guest
  id: number;
  fullName: string;
  createdAtMs: number;
  emailAddress?: string;
  isGuest: boolean;
}


interface TestCategory {  // try to merge with Category in model.ts?
  id: number;
  sectionPageId: string;
  parentId?: number;
  defaultCategoryId?: number;
  name: string;
  slug: string;
  position?: number;
  description?: string;
  newTopicTypes?: string;
  defaultTopicType: number;
  createdAtMs: number;
  updatedAtMs: number;
  lockedAtMs?: number;
  frozenAtMs?: number;
  deletedAtMs?: number;
  hideInForum: boolean;
}


interface NewPage {
  id: PageId;
  role: PageRole;
  categoryId?: CategoryId;
  authorId: UserId;
  createdAtMs?: number;
  updatedAtMs?: number;
  numChildPages?: number;
  numRepliesVisible?: number;
  numRepliesToReview?: number;
  numRepliesTotal?: number;
  numLikes?: number;
  numWrongs?: number;
  numBuryVotes?: number;
  numUnwantedVotes?: number;
  numOpLikeVotes?: number;
  numOpWrongVotes?: number;
  numOpBuryVotes?: number;
  numOpUnwantedVotes?: number;
  numOpRepliesVisible?: number;
  version?: number;
}


interface Page {
  id: string;
  role: PageRole;
  categoryId?: number;
  embeddingPageUrl?: string;
  authorId: number;
  createdAtMs: number;
  updatedAtMs: number;
  publishedAtMs?: number;
  bumpedAtMs?: number;
  lastReplyAtMs?: number;
  numChildPages?: number;
  numRepliesVisible?: number;
  numRepliesToReview?: number;
  numRepliesTotal?: number;
  pinOrder?: number;
  pinWhere?: number;
  numLikes?: number;
  numWrongs?: number;
  numBuryVotes?: number;
  numUnwantedVotes?: number;
  numOpLikeVotes?: number;
  numOpWrongVotes?: number;
  numOpBuryVotes?: number;
  numOpUnwantedVotes?: number;
  numOpRepliesVisible?: number;
  answeredAtMs?: number;
  answerPostId?: number;
  doneAtMs?: number;
  closedAtMs?: number;
  lockedAtMs?: number;
  frozenAt?: number;
  deletedAtMs?: number;
  deletedById?: number;
  unwantedAt?: number;
  plannedAt?: number;
  version: number;
  lastReplyById?: number;
  frequentPoster1Id?: number;
  frequentPoster2Id?: number;
  frequentPoster3Id?: number;
  frequentPoster4Id?: number;
}


interface PagePathWithId {
  folder: string;
  pageId: string;
  showId: boolean;
  slug: string;
}


interface NewTestPost {
  id?: number;
  page: Page;
  nr: number;
  parentNr?: number;
  approvedSource: string;
  approvedHtmlSanitized?: string;
}


interface TestPost {  // later: try to unify with Post?
  id: number;
  pageId: string;
  nr: number;
  parentNr?: number;
  multireply?: string;
  createdAtMs: number;
  createdById: number;
  currRevStartedAtMs: number;
  currRevLastEditedAtMs?: number;
  currRevById: number;
  lastApprovedEditAtMs?: number;
  lastApprovedEditById?: number;
  numDistinctEditors: number;
  numEditSuggestions: number;
  lastEditSuggestionAtMs?: number;
  safeRevNr?: number;
  approvedSource?: string;
  approvedHtmlSanitized?: string;
  approvedAtMs?: number;
  approvedById?: number;
  approvedRevNr?: number;
  currRevSourcePatch?: string;
  currRevNr: number;
  /*
  collapsedStatus         | smallint                    | not null
  collapsed_at             | timestamp without time zone |
  collapsed_by_id          | integer                     |
  closed_status            | smallint                    | not null
  closed_at                | timestamp without time zone |
  closed_by_id             | integer                     |
  hidden_at                | timestamp without time zone |
  hidden_by_id             | integer                     |
  hidden_reason            | character varying           |
  */
  deletedStatus: number;
  deletedAtMs?: number;
  deletedById?: number;
  /*
  pinned_position          | smallint                    |
  pinned_at                | timestamp without time zone |
  pinned_by_id             | integer                     |
  */
  numPendingFlags?: number;
  numHandledFlags?: number;
  numLikeVotes: number;
  numWrongVotes: number;
  numTimesRead: number;
  numBuryVotes: number;
  numUnwantedVotes: number;
  type?: number;
  prevRevNr?: number;
}


interface NewCategoryStuff {
  category: Category;
  aboutPage: Page;
  aboutPageTitlePost: Post;
  aboutPageBody: Post;
}


interface IdAddress {
  id: string;
  siteIdOrigin: string;
}


interface EmailSubjectBody {
  subject: string;
  bodyHtmlText: string
}

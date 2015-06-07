/*
 * Copyright (C) 2015 Kaj Magnus Lindberg
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/// <reference path="../../typedefs/react/react.d.ts" />
/// <reference path="../../shared/plain-old-javascript.d.ts" />
/// <reference path="../ReactStore.ts" />
/// <reference path="../Server.ts" />

//------------------------------------------------------------------------------
   module debiki2.pagedialogs {
//------------------------------------------------------------------------------

var d = { i: debiki.internal, u: debiki.v0.util };
var r = React.DOM;
var reactCreateFactory = React['createFactory'];
var ReactBootstrap: any = window['ReactBootstrap'];
var Button = reactCreateFactory(ReactBootstrap.Button);
var Input = reactCreateFactory(ReactBootstrap.Input);
var Modal = reactCreateFactory(ReactBootstrap.Modal);
var ModalTrigger = reactCreateFactory(ReactBootstrap.ModalTrigger);
var OverlayMixin = ReactBootstrap.OverlayMixin;


export var aboutUserDialog;


export function createAboutUserDialog() {
  var aboutUserDialogElem = document.getElementById('dw-react-about-user-dialog');
  if (aboutUserDialogElem) {
    aboutUserDialog = React.render(AboutUserDialog(), aboutUserDialogElem);
  }
}


var AboutUserDialog = createComponent({
  mixins: [OverlayMixin],

  getInitialState: function () {
    return {
      isOpen: false,
      user: null,
      post: null,
      loggedInUser: debiki2.ReactStore.getUser()
    };
  },

  open: function(post: Post) {
    this.setState({ isOpen: true, post: post, blocks: {} });
    this.loadUser(post.authorId);
  },

  close: function() {
    this.setState({ isOpen: false, user: null, post: null });
  },

  reload: function() {
    this.loadUser(this.state.user.id);
    this.setState({ user: null, blocks: {} });
  },

  loadUser: function(userId: number) {
    Server.loadCompleteUser(userId, (user: CompleteUser) => {
      if (!this.isMounted()) return;
      Server.loadAuthorBlockedInfo(this.state.post.uniqueId, (blocks: Blocks) => {
        if (!this.isMounted()) return;
        // These two are only included in the response for staff.
        var ipBlock;
        var browserBlock;
        _.each(blocks.blocks, (block: Block) => {
          if (block.ip) {
            ipBlock = block;
          }
          if (block.browserIdCookie) {
            browserBlock = block;
          }
        })
        this.setState({
          user: user,
          blocks: {
            isBlocked: blocks.isBlocked,
            ipBlock: ipBlock,
            browserBlock: browserBlock,
            blockedForever: blocks.blockedForever,
            blockedTillMs: blocks.blockedTillMs
          }
        });
      });
    });
  },

  viewUserProfile: function() {
    window.location.assign('/-/users/#/id/' + this.state.user.id);
  },

  render: function () {
    return null;
  },

  renderOverlay: function () {
    if (!this.state.isOpen)
      return null;

    var user: CompleteUser = this.state.user;
    var childProps = $.extend({
      reload: this.reload,
      loggedInUser: this.state.loggedInUser,
      post: this.state.post,
      user: user,
      viewUserProfile: this.viewUserProfile,
      blocks: this.state.blocks
    }, this.props);

    var content;
    var who;
    if (!user) {
      content = r.p({}, 'Loading...');
    }
    else if (isGuest(user)) {
      content = AboutGuest(childProps);
      who = 'Guest';
    }
    else {
      content = AboutUser(childProps);
      who = 'User';
    }

    return (
      Modal({ title: 'About ' + who, onRequestHide: this.close },
        r.div({ className: 'modal-body' }, content),
        r.div({ className: 'modal-footer' },
          Button({ onClick: this.close }, 'Close'))));
  }
});


var AboutUser = createComponent({
  render: function() {
    var user: CompleteUser = this.props.user;

    var isStaffInfo = null;
    if (user.isModerator) {
      isStaffInfo = 'Is moderator.';
    }
    if (user.isAdmin) {
      isStaffInfo = 'Is administrator.';
    }

    return (
      r.div({},
        r.div({ className: 'dw-about-user-actions' },
          Button({ onClick: this.props.viewUserProfile }, 'View Profile')),
        r.p({},
          'Username: ' + user.username, r.br(),
          'Name: ' + user.fullName, r.br(),
          isStaffInfo)));
  }
});


var AboutGuest = createComponent({
  unblockGuest: function() {
    Server.unblockGuest(this.props.post.uniqueId, () => {
      this.props.reload();
    });
  },

  render: function() {
    var guest: Guest = this.props.user;
    var loggedInUser: User = this.props.loggedInUser;
    var blocks: Blocks = this.props.blocks;
    var postId = this.props.post.uniqueId;

    var blockButton;
    if (loggedInUser.isAdmin) {
      if (blocks.isBlocked) {
        blockButton =
          Button({ title: 'Let this guest post comments again', onClick: this.unblockGuest },
            'Unblock');
      }
      else {
        blockButton =
            ModalTrigger({ modal: BlockGuestDialog({ postId: postId, reload: this.props.reload }) },
              Button({ title: 'Prevent this guest from posting more comments' },
                'Block This Guest'));
      }
    }

    var blockedInfo;
    if (blocks.isBlocked) {
      var text = 'This guest is blocked ';
      if (blocks.blockedForever) {
        text += 'forever';
      }
      else {
        text += 'until ' + moment(blocks.blockedTillMs).format('YYYY-MM-DD HH:mm');
      }
      var reason = blocks.reason ? blocks.reason : '(unspecified)';
      blockedInfo =
        r.p({ className: 'dw-guest-blocked' },
          text, r.br());
          // 'Reason: ' + reason);
    }

    return (
      r.div({ className: 'clearfix' },
        r.div({ className: 'dw-about-user-actions' },
          Button({ onClick: this.props.viewUserProfile }, 'View Other Comments'),
          blockButton),
        r.p({},
          'Name: ' + guest.fullName, r.br(),
          'This is a guest user. He or she could in fact be just anyone.'),
        blockedInfo));
  }
});


var BlockGuestDialog = createComponent({
  doBlock: function() {
    var numDays = parseInt(this.refs.daysInput.getValue());
    if (isNaN(numDays)) {
      alert('Please enter a number');
      return;
    }
    var reason = ''; // this.refs.reasonInput.getValue();
    if (reason.length > 255) {
      alert("At most 255 characters please");
      return;
    }
    Server.blockGuest(this.props.postId, numDays, () => {
      this.props.onRequestHide();
      this.props.reload();
    });
  },

  render: function() {
    var props = $.extend({ title: 'Block Guest' }, this.props);
    return (
      Modal(props,
        r.div({ className: 'modal-body' },
          r.p({}, "Once blocked, this guest cannot post any comments or like any posts. " +
            "He or she can, however, still authenticate himself / herself " +
            "and sign up as a real user."),
          Input({ type: 'number', label: 'Block for how many days?', ref: 'daysInput' })
          /*
          Input({ type: 'text', label: 'Why block this guest? (Optional)',
              help: "This will be visible to everyone. Keep it short.", ref: 'reasonInput' })),
             */ ),

        r.div({ className: 'modal-footer' },
          Button({ onClick: this.doBlock }, 'Block'),
          Button({ onClick: this.props.onRequestHide }, 'Cancel'))));
  }
});

//------------------------------------------------------------------------------
   }
//------------------------------------------------------------------------------
// vim: fdm=marker et ts=2 sw=2 tw=0 fo=r list

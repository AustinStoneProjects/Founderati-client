var Config = require('config');

var SocialSignInForm = function () {
	var socialSignInForm = {};

	socialSignInForm.vm = {

	};

	socialSignInForm.stream = new Bacon.Bus();

	var facebookLogin = function() {
        FB.init({
            appId      : Config['FACEBOOK_APP_ID'],
            xfbml      : true,
            version    : 'v2.1'
        });

		FB.login(function(response) {
			if (response.authResponse) {
				console.log(response.authResponse);
			}
		});
	};

	socialSignInForm.view = function () {
		return [
			m('form.socialSignInForm.ui.form', [
				m('div.ui.one.column.grid', [
					m('div.column', [
						m('div.grouped.fields', [
							m('div.ui.facebook.button', {
									onclick: facebookLogin
								},[
									m('i.facebook.icon'),
									'Sign up with Facebook'
								]
							)
						]),
						m('div.grouped.fields', [
							m('div.ui.twitter.button', [
								m('i.twitter.icon'),
								'Sign up with Twitter'
							])
						]),
						m('div.grouped.fields', [
							m('div.ui.google.plus.button', [
								m('i.google.plus.icon'),
								'Sign up with Google Plus'
							])
						])
					])
				])
			])
		]
	};

	return socialSignInForm;
};

module.exports = SocialSignInForm;

var Navbar = require('navigation/navbar');

var SimplePageLayoutMixin = function () {
	// Instantiate singletons (Navbar, side navigations, footers)
	var navbar = new Navbar();

	return function (body) {
		var layout = {};

		layout.stream = Bacon.mergeAll(body.stream, navbar.stream);

		layout.controller = function () {
			body.controller();
		};

		layout.view = function () {
			return [
				m('div', [
					m('header', [
						navbar.view()
					]),
					m('main', [
						body.view()
					])
				])
			]
		};

		return layout;
	};
};

module.exports = SimplePageLayoutMixin;

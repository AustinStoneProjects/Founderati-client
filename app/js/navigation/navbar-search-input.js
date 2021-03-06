var StreamCommon = require('common/stream-common');
var ENTER_KEY = require('common/constants').ENTER_KEY;

var NavbarSearchInput = function (parameters) {
	var searchInput = {},
		defaultParameters = {
			minCharacters: 0,
			delay: 1000
		};

	parameters = _.extend(defaultParameters, parameters);

	searchInput.stream = new Bacon.Bus();

	var vm =
	searchInput.vm = {
		searchQuery: m.prop(''),

		search: function () {
			if (vm.searchQuery().length >= parameters.minCharacters) {
				searchInput.stream.push(new StreamCommon.Message('SearchInput::Search',
					{ query_string: vm.searchQuery() }));
			}
		}
	};

	var keyHandlers = {};
	keyHandlers[ENTER_KEY] = function () {
		vm.search();
	};

	function keyup(e) {
		if (keyHandlers[e.keyCode]) {
			keyHandlers[e.keyCode]();
		} else {
			m.redraw.strategy('none');
		}
	}

	searchInput.view = function () {
		// Populate search bar with current query
		// Has to be in the view code since during init, no route exists.
		var queryString = m.route.param('query_string');
		if (queryString && !searchInput.vm.searchQuery()) {
			searchInput.vm.searchQuery(queryString);
		}

		return m('div.ui.fluid.action.input', [
			m('input[type="text"]', { placeholder: 'Search', onkeyup: keyup,
				onchange: m.withAttr('value', vm.searchQuery), value: vm.searchQuery() }),
			m('div.ui.icon.button', { onclick: vm.search }, [
				m('i.search.icon')
			])
		]);
	};

	return searchInput;
};

module.exports = NavbarSearchInput;

var ConnectWith = function () {

  var User = require('model/user');
  var connectWith = {};

	var vm =
  connectWith.vm = {
    init: function() {


		}
  };

  connectWith.controller = function() {
    vm.init()
  };

	connectWith.view = function () {
		return [
			m("div", "U WANNA CONNECT NIGGA?")
		];
	};
};

module.exports = ConnectWith;
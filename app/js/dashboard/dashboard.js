/**
 * Provides dashboard page
 * @jsx m
 */

var Context = require('common/context');
var EntityList = require('profile/entity-list');
var Error = require('common/error');
var HorizontalEntityListSegment = require('dashboard/horizontal-entity-list-segment');
var User = require('model/user');
var UserEdges = require('model/user-edges');
var StreamCommon = require('common/stream-common');

var handlePlural = require('common/utils-general').handlePlural;

function twitterIntegration(element, isInitialized) {
	if (!isInitialized) {
		!function(d,s,id){
			var js, fjs = element, p = /^http:/.test(d.location) ? 'http' : 'https';
			if (!d.getElementById(id)) {
				js = d.createElement(s);
				js.id = id;
				js.src = p + "://platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js,fjs);
			}
		}(document,"script","twitter-wjs");
	}
}

var dashboard = {};

dashboard.vm = {
	init: function () {
		this.pendingRequestsSegment = null;
		this.connectionsSegment = null;

		this.basicInfo = null;
		this.edges = null;

		Context.getCurrentUser().then(function(response) {
			dashboard.vm.basicInfo = response;
		});

		Context.getCurrentUserEdges().then(
			function(response) {
				dashboard.vm.edges = response;
				dashboard.vm.connectionsSegment = new HorizontalEntityListSegment(
					'Connections',
					'/profile',
					function() {
						return dashboard.vm.edges().connections();
					},
					User,
					{searchable: true}
				);
				dashboard.vm.pendingRequestsSegment = new HorizontalEntityListSegment(
					'Pending Requests',
					'/profile',
					function() {
						return dashboard.vm.edges().pendingConnections();
					},
					User,
					{showAll: true}
				);
			}, Error.handle);

		dashboard.stream = null;
		StreamCommon.on(Context.stream, 'Context::Edges', function (message) {}, true);
	}
};

dashboard.controller = function () {
	dashboard.vm.init();
};

dashboard.view = function () {
	var vm = dashboard.vm;

	var basicInfo = dashboard.vm.basicInfo();
	
	var numPendingRequests = [];
	var numConnections = 0;
	var suggestedConnections = [];
	var numEndorsements = 2;

	if (dashboard.vm.edges) {
		numPendingRequests = dashboard.vm.edges().pendingConnections().length;
		numConnections = dashboard.vm.edges().connections().length;
		suggestedConnections = dashboard.vm.edges().suggestedConnections();
	}

	var suggestedConnectionsSegment = new EntityList(
		'Suggested Connections',
		'/profile',
		suggestedConnections,
		User,
		true
	).view({});

	return (
		<div className="ui stackable padded grid">
			<div className="row">
				<div className="four wide column">
					<div className="ui stackable grid">
						<div className="row">
							<div className="sixteen wide tablet computer only column" config={twitterIntegration}>
								<a className="twitter-timeline" href="https://twitter.com/search?q=austin%20startup" data-widget-id="555318512722272256">Tweets about austin startup</a>
							</div>
						</div>
					</div>
				</div>
				<div className="twelve wide column">
					<div className="ui stackable grid">
						<div className="row">
							<div className="sixteen wide column">
								<div className="ui segment bull">
									<div className="ui grid">
										<div className="row">
											<div className="six wide column">
												<div className="ui header">
													Howdy, {basicInfo.firstName()}!
												</div>
												Looks like you're new to the site!
												You're going to want to fill out your profile with your
												avid interests, proudest moments, and best skills.
												<div className="ui bulleted list">
													<a href="/profile/me" config={m.route} className="item">Update my profile</a>
												</div>
											</div>
											<div className="twelve wide computer tablet only column"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						 <div className="row">
							<div className="ten wide column">
								<div className="ui segment">
									<h4 className="ui left floated header">Today</h4>
									<div className="ui statistic">
										<div className="value">{numPendingRequests}</div>
										<div className="label">
											<div className="ui list">
												<a href="#pending-requests" className="item">
													{handlePlural('Pending Request', numPendingRequests)}
												</a>
											</div>
										</div>
									</div>
									<div className="ui statistic">
										<div className="value">{numConnections}</div>
										<div className="label">
											<div className="ui list">
												<a href="#connections" className="item">
													{handlePlural('Connection', numConnections)}
												</a>
											</div>
										</div>
									</div>
									<div className="ui statistic">
										<div className="value">{numEndorsements}</div>
										<div className="label">
											<div className="ui list">
												<a className="item">
													{handlePlural('Endorsement', numEndorsements)}
												</a>
											</div>
										</div>
									</div>
								</div>
								<div className="ui segment">
									<h4 className="ui header">Find</h4>
									<div className="ui content">
										<div className="3 fluid ui orange buttons">
											<a href="/search?role=Startupper" config={m.route} className="ui button">
												Startuppers
											</a>
											<a href="/search?role=Founder" config={m.route} className="ui button">
												Founders
											</a>
											<a href="/search?role=Investor" config={m.route} className="ui button">
												Investors
											</a>
										</div>
									</div>
								</div>
								<div className="ui segment">
									<h4 className="ui header">Actions</h4>
									<div className="ui content">
										<div className="ui bulleted list">
											<a className="item">Find someone</a>
											<a href="/profile/me" config={m.route} className="item">Update my profile</a>
										</div>
									</div>
								</div>
								<div id="pending-requests"></div>
								{ dashboard.vm.pendingRequestsSegment && dashboard.vm.edges().pendingConnections().length ?
									dashboard.vm.pendingRequestsSegment.view({}) : null }
								<div id="connections"></div>
								{ dashboard.vm.connectionsSegment ?
									dashboard.vm.connectionsSegment.view({}) : null }
							</div>
							<div className="six wide column">
								<div className="ui segment">
									<h4 className="ui header">Invite Others</h4>
									<div className="ui content">
										<div className="ui orange button">Create Invite</div>
										<div className="ui divider"></div>
										<div className="fluid ui action input">
											<input type="text" value="http://ww.short.url/c0opq" placeholder="Invite Link" readonly />
											<div className="ui gray right icon button">
												<i className="copy icon"></i>
											</div>
										</div>
									</div>
								</div>
								{ suggestedConnectionsSegment }
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};


module.exports = dashboard;

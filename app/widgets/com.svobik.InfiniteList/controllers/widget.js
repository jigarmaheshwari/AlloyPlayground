var moment = require('alloy/moment');

/**
 * Widget options
 */
var options = {
	pullMsg : L('pvPullMessage', 'Pull to refresh'),
	pulledMsg : L('pvPulledMessage', 'Release to refresh'),
	loadingMsg : L('pvLoadingMessage', 'Loading new content...'),
	inProgress : false,
};

/**
 * Retrieves current formatted date
 */
function getFormattedDate() {
	return moment().format('DD/MM/YYYY HH:mm');
}

/**
 * Retrieves PullView message based on pullend param
 */
function getPullViewMessage(pulled) {

	if (pulled) {
		return options.pulledMsg;
	}

	return options.pullMsg;
}

/**
 * Retrieves PullView message based on pullend param
 */
function getPullViewTimestamp() {

	return String.format(L('pvTimestamp'), getFormattedDate());
}

function doListItemClick(e) {
	//var item = e.section.getItemAt(e.itemIndex);
	alert('You click me! #' + e.itemIndex);
}

function doLoadData(callback) {
	try {
		alert('Loaded');
		return true;
	} catch(err) {
		alert('Error');
		return false;
	} finally {
		callback();
	}
}

/**
 * Loads ListView's data
 */
function loadData() {
	doLoadData(function() {
		resetPullView();
	});

}

/**
 * Resets PullView to its default state
 */
function resetPullView() {

	$.pvActivityIndicator.hide();

	$.pvImage.transform = Ti.UI.create2DMatrix();
	$.pvImage.show();

	$.pvMessage.text = getPullViewMessage(false);
	$.pvTimestamp.text = getPullViewTimestamp();

	$.listView.setContentInsets({
		top : 0
	}, {
		animated : true
	});

	options.inProgress = false;
}

/**
 * Handles ListView's pull down action
 */
function pullListener(e) {

	if (false === options.inProgress) {

		if (e.active == false) {
			var rotation = Ti.UI.create2DMatrix();
		} else {
			var rotation = Ti.UI.create2DMatrix().rotate(180);
		}

		$.pvImage.animate({
			transform : rotation,
			duration : 180
		});

		$.pvMessage.text = getPullViewMessage(e.active);
	}
}

/**
 * Handles ListView's pullend action
 */
function pullendListener() {

	if (false === options.inProgress) {

		options.inProgress = true;

		$.pvImage.hide();

		$.pvActivityIndicator.show();

		$.pvMessage.text = options.loadingMsg;

		$.listView.setContentInsets({
			top : 65,
		}, {
			animated : true,
		});

		setTimeout(function() {
			loadData();
		}, 4000);
	}
}

/**
 * Creates ListView
 */
function createListView(_data) {

	// ListView items stack
	var items = [];

	for (var i = 0; i < _data; i++) {
		var item = {
			heading : {
				text : 'Heading ' + i
			},
			excerpt : {
				text : 'This is short excerpt #' + i
			},
		};

		items.push(item);
	};

	// Sets list section items
	$.listSection.setItems(items);
}

/**
 * Creates PullView
 */
function createPullView() {

	if (OS_ANDROID) {

	}

	$.pvMessage.text = getPullViewMessage();
	$.pvTimestamp.text = getPullViewTimestamp();
}

/**
 * Inits widget
 */
function init() {

	if (OS_IOS) {
		$.listView.addEventListener('pull', pullListener);
		$.listView.addEventListener('pullend', pullendListener);

	} else {

		$.listView.top = 0 - $.pvView.height;

		//$.listView.addEventListener('swipe', swipeListener);
	}

	$.listView.addEventListener('itemclick', function(e) {
		doListItemClick(e);
	});

	createPullView();
	createListView(20);
}

init();

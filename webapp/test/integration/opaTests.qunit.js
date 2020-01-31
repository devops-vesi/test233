/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/vesi/ZFIOAFIDIPANALYTIC/ZFIOAFI_DIPANALYTIC/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
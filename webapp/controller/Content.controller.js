sap.ui.define([
	"com/vesi/ZFIOAAN_PROJ_DISP/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"com/vesi/ZFIOAAN_PROJ_DISP/model/formatter",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function (BaseController, Filter, FilterOperator, Device, MessageToast, formatter, Export, ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.vesi.ZFIOAAN_PROJ_DISP.controller.Content", {

		formatter: formatter,

		/**
		 * 
		 * TO DO
		 */
		onInit: function () {
			// Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			this._mViewSettingsDialogs = {};
		},

		/**
		 * 
		 * TO DO
		 */
		onExit: function () {
			var oDialogKey,
				oDialogValue;

			for (oDialogKey in this._mViewSettingsDialogs) {
				oDialogValue = this._mViewSettingsDialogs[oDialogKey];

				if (oDialogValue) {
					oDialogValue.destroy();
				}
			}
		},

		/**
		 * 
		 * TO DO
		 */
		onGenericTagPress: function (oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("com.vesi.ZFIOAAN_PROJ_DISP.view.fragments.Card", this);
				this.getView().addDependent(this._oPopover);
			}

			this._oPopover.openBy(oEvent.getSource());
		},

		/**
		 * 
		 * TO DO
		 */
		getInitialFilters: function () {
			var sProject = "P.0098182.5.23"; //oEvent.getParameter("arguments").Project;
			var sID = "0002"; //oEvent.getParameter("arguments").ID;

			var aFilters = [];
			aFilters.push(new Filter("Project", FilterOperator.EQ, sProject));
			aFilters.push(new Filter("ID", FilterOperator.EQ, sID));

			return aFilters;
		},

		/**
		 * 
		 * TO DO
		 */
		applyFiltersForHoursDetail: function () {
			/*			var sProject = "P.0098182.5.23"; //oEvent.getParameter("arguments").Project;
						var sID = "0002"; //oEvent.getParameter("arguments").ID;*/

			var aFilters = [];
			/*			aFilters.push(new Filter("Project", FilterOperator.EQ, sProject));
						aFilters.push(new Filter("ID", FilterOperator.EQ, sID));*/

			aFilters = this.getInitialFilters();

			var oTableHoursBreakdown = this.getView().byId("TableHoursBreakdown");
			var oBinding = oTableHoursBreakdown.getBinding("items");
			oBinding.filter(aFilters);
			oBinding.refresh(true);
		},

		/**
		 * 
		 * TO DO
		 */
		onAfterRendering: function () {
			this.applyFiltersForHoursDetail();
		},

		/**
		 * 
		 * TO DO
		 */
		onNavButtonPressed: function () {
			this.getOwnerComponent().getRouter().navTo("home");
		},

		/**
		 * 
		 * TO DO
		 */
		handleExportPressed: function (oEvent) {
			var oModelData = this.getOwnerComponent().getModel("evListModel");

			var aFilters = [];
			aFilters = this.getInitialFilters();
			//var aSorter = [];
			//aSorter.push(new sap.ui.model.Sorter("ID3", true));
			var oExport = new sap.ui.core.util.Export({
				exportType: new sap.ui.core.util.ExportTypeCSV({
					separatorChar: ";"
				}),

				// Pass in the model created above
				models: oModelData,

				// binding information for the rows aggregation
				rows: {
					path: "/GetHourDetailsSet",
					filters: aFilters // [this.getGlobalFilters()]
						/*					parameters: {
												expand: "ServiceRequestParty",
												select: "ServiceRequestParty/RoleCode,ServiceRequestParty/FormattedName"
											},*/
						//sorter: aSorter
				},

				// column definitions with column name and binding info for the content
				columns: [{
						name: this.getResourceBundle().getText("tableHoursBreakdownSections"),
						template: {
							content: "{Section}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownPeriods"),
						template: {
							content: "{Period}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownWeeks"),
						template: {
							content: "{Week}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownnoofHours"),
						template: {
							content: "{HourNum}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownHourstype"),
						template: {
							content: "{HourType}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownValuatedAmount"),
						template: {
							content: "{ValueAmount}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownValuatedAmount"),
						template: {
							content: "{ValueAmount}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownEmployeesNo"),
						template: {
							content: "{EmployeeNum}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownLastFirstName"),
						template: {
							content: "{LastFirstName}"
						}
					}, {
						name: this.getResourceBundle().getText("tableHoursBreakdownAnalyticalUnit"),
						template: {
							content: "{AnalyticalUnit}"
						}
					}
					/*{
						name: this.getResourceBundle().getText("txtDateProcess"),
						template: {
							content: {
								parts: ["DateError"],
								formatter: function (value) {
									if (value) {
										var date = new Date(value);
										var year = date.getFullYear();
										var month = date.getMonth();
										var day = date.getDate();
										var hours = date.getHours();
										var minutes = date.getMinutes();
										date = new Date(year, month, day, hours, minutes);
										var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
											pattern: "dd/MM/yyyy" // HH:mm"
										});

										var string = oDateFormat.format(date);
										return string;
									}
								}
							}
						}
					},
					{
						name: this.getResourceBundle().getText("txtDaysInError"),
						template: {
							content: {
								parts: ["DateError", "DateCorrection", "IsErrorProcessed"],
								formatter: function (dDateProcess, dDateCorrection, IsErrorProcessed) {

									if (IsErrorProcessed === "X") {
										var dDateToday = new Date();
										// To calculate the time difference of two dates 
										var iDifference_In_Time = dDateToday.getTime() - dDateProcess.getTime();
										// To calculate the no. of days between two dates 
										var iDifference_In_Days = iDifference_In_Time / (1000 * 3600 * 24);
										var sResult = parseInt(iDifference_In_Days);
										return sResult.toString();
									} else {
										if (dDateProcess !== null && dDateCorrection !== null && IsErrorProcessed !== null) {
											var dDateToday = dDateCorrection;
											// To calculate the time difference of two dates 
											var iDifference_In_Time = dDateToday.getTime() - dDateProcess.getTime();
											// To calculate the no. of days between two dates 
											var iDifference_In_Days = iDifference_In_Time / (1000 * 3600 * 24);
											var sResult = parseInt(iDifference_In_Days);
											return sResult.toString();
										}
									}

								}
							}
						}
					},*/
				]
			});

			// download exported file
			oExport.saveFile().catch(function (oError) {
				//MessageBox.error(this.getResourceBundle().getText("ErrorFile") + "\n\n" + oError);
				//this._showMessageToast("Error read data");
			}).then(function () {
				oExport.destroy();
			});
		},
		//	},

		/**
		 * 
		 * TO DO
		 */
		createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
				this.getView().addDependent(oDialog); // My New Line

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},

		/**
		 * 
		 * TO DO
		 */
		handleSortButtonPressed: function (oEvent) {
			this.createViewSettingsDialog("com.vesi.ZFIOAAN_PROJ_DISP.view.fragments.SortDialog").open();
		},
		
		/**
		 * 
		 * TO DO
		 */
		handleFilterButtonPressed: function (oEvent) {
			this.createViewSettingsDialog("com.vesi.ZFIOAAN_PROJ_DISP.view.fragments.FilterDialog").open();
		},
		
		/**
		 * 
		 * TO DO
		 */		
		handleGroupButtonPressed: function (oEvent) {
			this.createViewSettingsDialog("com.vesi.ZFIOAAN_PROJ_DISP.view.fragments.GroupDialog").open();
		},		

		/**
		 * Handles the press event on a process flow node.
		 *
		 * @param {sap.ui.base.Event} oEvent The press event object
		 */
		onNodePressed: function (oEvent) {
			var sItemTitle = oEvent.getParameters().getTitle();
			MessageToast.show(this.getResourceBundle().getText("processFlowNodeClickedMessage", [sItemTitle]));
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Calculates difference between expected and actual values
		 * @param {float} fFirstValue Expected value
		 * @param {float} fSecondValue Actual value
		 * @returns {number} Textual representation of delta between two given values with specifier measurement unit
		 */
		getValuesDelta: function (fFirstValue, fSecondValue) {
			return fSecondValue - fFirstValue;
		}
	});
});
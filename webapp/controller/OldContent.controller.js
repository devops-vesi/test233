sap.ui.define([
	"com/vesi/ZFIOAAN_PROJ_DISP/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function (BaseController, JSONModel, ChartFormatter, Format, MessageToast, Filter, FilterOperator, Export, ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.vesi.ZFIOAAN_PROJ_DISP.controller.Content", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.vesi.ZFIOAAN_PROJ_DISP.view.Content
		 */
		onInit: function () {
			var oModelData = this.getOwnerComponent().getModel();
			oModelData.setSizeLimit("5000");
			// set explored app's demo model on this sample
			//var oModelComboBox = new JSONModel("./mockdata/products.json"); // ("./model/tiles.json");
			//this.getView().setModel(oModelComboBox);

			// Fill Begin Date and End Date
		
		},

		/**
		 * TO DO
		 */
		getUserCustInformations: function () {
			var that = this;
			var aFilters = [];
			aFilters.push(new Filter("Uname", FilterOperator.EQ, this.getUserId()));
			var oODataCodexModel = this.getOwnerComponent().getModel();
			oODataCodexModel.read("/UserCustInfoSet", {
				filters: aFilters,
				success: function (oData, oResponse) {
					that.mapUserSettingsResults(oData);
					//that.getRouter().initialize();
				},
				error: function () {
					// show error messge 
					sap.m.MessageToast.show("Codex Back-End Error");
				}
			});
		},

		/**
		 * TO DO
		 */
		getUserTabInformations: function () {
			var that = this;
			var aFilters = [];
			aFilters.push(new Filter("Uname", FilterOperator.EQ, this.getUserId()));
			var oODataCodexModel = this.getOwnerComponent().getModel();
			oODataCodexModel.read("/UserTabInfoSet", {
				filters: aFilters,
				success: function (oData, oResponse) {
					that.mapUserTabResults(oData);
				},
				error: function () {
					// show error messge 
					sap.m.MessageToast.show("Codex Back-End Error");
				}
			});
		},

		/**
		 * ******
		 * ******
		 * TO DO
		 */
		getUserId: function () {
			var sUserId = "";
			if (sap.ushell !== null && sap.ushell !== undefined) {
				sUserId = sap.ushell.Container.getUser().getId();
			} else {
				sUserId = "MBECHET";
			}
			return sUserId;
		},

		/**
		 * TO DO
		 */
		mapUserSettingsResults: function (oData) {
			var aUserCust = [];
			var vDivision;
			var vPole;
			var vCompanyCode;

			aUserCust = oData.results;

			for (var index = 0; index < aUserCust.length; index++) {
				vDivision = aUserCust[index].Division;
				vPole = aUserCust[index].Pole;
				vCompanyCode = aUserCust[index].CompanyCode;
			}

			var oModel = new JSONModel({
				defaultDivision: vDivision,
				defaultPole: vPole,
				defaultCompanyCode: vCompanyCode
			});
			this.getView().setModel(oModel, "ModelUserCust");

			this.handleDivisionSelectionChange();
			this.handlePoleSelectionChange();
			this.handleSelectionChange();
		},

		/**
		 * TO DO
		 */
		mapUserTabResults: function (oData) {
			var aUserTab = [];
			var vInvoiceSend;
			var vInvoiceReceive;
			var vOrderSend;
			var vIsSearchActif;

			aUserTab = oData.results;

			for (var index = 0; index < aUserTab.length; index++) {
				vInvoiceSend = aUserTab[index].InvoiceSend;
				vInvoiceReceive = aUserTab[index].InvoiceReceive;
				vOrderSend = aUserTab[index].OrderSend;
				vIsSearchActif = aUserTab[index].IsSearchActif;
			}

			var oModel = new JSONModel({
				defaultInvoiceSend: vInvoiceSend,
				defaultInvoiceReceive: vInvoiceReceive,
				defaultOrderSend: vOrderSend,
				defaultIsSearchActif: vIsSearchActif
			});
			this.getView().setModel(oModel, "ModelUserTab");
		},

		/**
		 * TO DO
		 */
		setYearsList: function () {
			// Set Current Year
			var vCurrentYear = new Date().getFullYear();
			//this.currentYear = vCurrentYear;
			var oModel = new JSONModel({
				currentYear: vCurrentYear
			});
			this.getView().setModel(oModel, "globalData");

			// Set Years List
			var aYearsList = [];
			var oYearObject = {};
			// Current Year
			oYearObject.YearId = vCurrentYear;
			oYearObject.YearText = vCurrentYear;
			aYearsList.push(oYearObject);
			// Last Year - 1
			oYearObject = {};
			vCurrentYear = vCurrentYear - 1;
			oYearObject.YearId = vCurrentYear;
			oYearObject.YearText = vCurrentYear;
			aYearsList.push(oYearObject);
			// Last Year - 2
			oYearObject = {};
			vCurrentYear = vCurrentYear - 1;
			oYearObject.YearId = vCurrentYear;
			oYearObject.YearText = vCurrentYear;
			aYearsList.push(oYearObject);

			var oYearCollection = {};
			oYearCollection.YearCollection = aYearsList;
			var oModelYearCollection = new JSONModel(oYearCollection);
			this.getView().setModel(oModelYearCollection, "ModelYearCollection");
		},

		/**
		 * TO DO
		 */
		setSelectionDates: function () {
			var dToday = new Date();
			var vCurrentYear = dToday.getFullYear();
			var vLastYear = dToday.getFullYear() - 1;
			var vCurrentMonth = dToday.getMonth();
			var oLastMonth = this.getLastMonth(dToday);
			var vLastMonth = oLastMonth.getMonth();

			//Set Date min - Max
			this.byId("dateFrom").setMinDate(new Date(vLastYear, 0, 1)); // Deactivate this for PoC and put the same year
			//this.byId("dateFrom").setMinDate(new Date(vCurrentYear, 0, 1));
			this.byId("dateFrom").setMaxDate(new Date(vCurrentYear, 11, 31));

			this.byId("dateTo").setMinDate(new Date(vLastYear, 0, 1));
			//this.byId("dateTo").setMinDate(new Date(vCurrentYear, 0, 1));
			this.byId("dateTo").setMaxDate(new Date(vCurrentYear, 11, 31));

			// Set default values
			if (vLastMonth < 12) {
				// Same year
				this.byId("dateFrom").setDateValue(new Date(vCurrentYear, vLastMonth, 1));
				this.byId("dateTo").setDateValue(new Date(vCurrentYear, vCurrentMonth, 1));
			} else {
				// Previous year
				this.byId("dateFrom").setDateValue(new Date(vLastYear, vLastMonth, 1));
				this.byId("dateTo").setDateValue(new Date(vCurrentYear, vCurrentMonth, 1));
			}

		},

		getLastMonth: function (dateObj) {
			var tempDateObj = new Date(dateObj);
			if (tempDateObj.getMonth) {
				tempDateObj.setMonth(tempDateObj.getMonth() - 1);
			} else {
				tempDateObj.setYear(tempDateObj.getYear() - 1);
				tempDateObj.setMonth(12);
			}
			return tempDateObj;
		},

		/**
		 * TO DO
		 */
		handleSelectionChange: function (oEvent) {
			// Company Code
			var aCompanyCode = [];
			var aCompanySelected = this.getView().byId("listCompanyCode").getSelectedKeys();
			aCompanySelected.forEach(function (element) {
				aCompanyCode.push(new Filter("CompanyCode", FilterOperator.EQ, element));
			});

			var oCompanyCodeFilter = new Filter({
				filters: aCompanyCode,
				and: false
			});

			//
			var aPole = [];

			// Busines Unit
			var vPoleSelected = this.getView().byId("listPole").getSelectedKey();
			aPole.push(new Filter("Pole", FilterOperator.EQ, vPoleSelected));

			if (vPoleSelected.length > 0) {
				var oPoleFilter = new Filter({
					filters: aPole,
					and: false
				});
			}
			
			var oMixFilters = new Filter({
				filters: [oCompanyCodeFilter, oPoleFilter],
				and: true
			});

			// Apply Filters
			var oListBusinesUnit = this.getView().byId("listBusinesUnit");
			var oBinding = oListBusinesUnit.getBinding("items");
			oBinding.filter([oMixFilters]);
			oBinding.refresh(true);
			this.getView().byId("listBusinesUnit").setEnabled(true);
		},

		/**
		 * TO DO
		 */
		handleDivisionSelectionChange: function (oEvent) {
			// Division
			var aDivision = [];
			//	var aDivisionSelected = this.getView().byId("listDivision").getSelectedKeys();
			var vDivisionSelected = this.getView().byId("listDivision").getSelectedKey();
			/*			aDivisionSelected.forEach(function (element) {
							aDivision.push(new Filter("Division", FilterOperator.EQ, element));
						});*/
			aDivision.push(new Filter("Division", FilterOperator.EQ, vDivisionSelected));

			var oDivisionFilter = new Filter({
				filters: aDivision,
				and: false
			});

			// Apply Filters
			var oListPole = this.getView().byId("listPole");
			var oBinding = oListPole.getBinding("items");
			oBinding.filter([oDivisionFilter]);
			oBinding.refresh(true);
			this.getView().byId("listPole").setEnabled(true);

			//this.getView().byId("listCompanyCode").setEnabled(false);
			//this.getView().byId("listBusinesUnit").setEnabled(false);			
		},

		/**
		 * TO DO
		 */
		handlePoleSelectionChange: function (oEvent) {
			// Pole
			var aPole = [];
			//var aPoleSelected = this.getView().byId("listPole").getSelectedKeys();
			var vPoleSelected = this.getView().byId("listPole").getSelectedKey();
			/*			aPoleSelected.forEach(function (element) {
							aPole.push(new Filter("Pole", FilterOperator.EQ, element));
						});*/
			aPole.push(new Filter("Pole", FilterOperator.EQ, vPoleSelected));

			var oPoleFilter = new Filter({
				filters: aPole,
				and: false
			});

			// Apply Filters
			var oListCompanyCode = this.getView().byId("listCompanyCode");
			var oBinding = oListCompanyCode.getBinding("items");
			oBinding.filter([oPoleFilter]);
			oBinding.refresh(true);
			this.getView().byId("listCompanyCode").setEnabled(true);
			
			this.handleSelectionChange();
		},

		/**
		 * TO DO
		 */
		handleChange: function (oEvent) {
			//var oText = this.byId("textResult");
			var oDP = oEvent.getSource();
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");

			MessageToast.show("Event 'selectionChange': " + sValue.toString() + "'", {
				width: "auto"
			});

			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
			}
		},

		/**
		 * Calls the message toast show method with the given message.
		 *
		 * @private
		 * @param {String} message Message for message toast
		 */
		_showMessageToast: function (message) {
			MessageToast.show(message);
		},

		/**
		 * TO DO
		 */
		onSearch: function (event) {
			// Apply filter for Invoice Sending
			this.applyFilterInvoiceSending(event);

			// Apply filter for Invoice Receiving
			this.applyFilterInvoiceReceiving(event);

			// Apply filter for Order Sending
			this.applyFilterOrderSending(event);
		},

		/**
		 * TO DO
		 */
		applyFilterInvoiceSending: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				// Call Codex Back-End
				var oFilters = this.getFilterFields();
				// Filter data source Error Tracking Unit
				this.getView().byId("idVizFrame").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrame").getDataset().getBinding("data").refresh(true);
				// Filter data source Monitoring Status
				this.getView().byId("idVizFrame1").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrame1").getDataset().getBinding("data").refresh(true);
				// Filter data source Performance Evolution Unit
				this.getView().byId("idVizFrame2").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrame2").getDataset().getBinding("data").refresh(true);
				// Filter data source Channel Distribution
				this.getView().byId("idVizFrame3").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrame3").getDataset().getBinding("data").refresh(true);
			}
		},

		/**
		 * TO DO
		 */
		applyFilterInvoiceReceiving: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				// Call Codex Back-End
				var oFilters = this.getFilterFields();
				// Filter data source Error Tracking Unit
				this.getView().byId("idVizFrameReceiving").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrameReceiving").getDataset().getBinding("data").refresh(true);
				// Filter data source Monitoring Status
				this.getView().byId("idVizFrame1Receiving").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrame1Receiving").getDataset().getBinding("data").refresh(true);
				// Filter data source Performance Evolution Unit
				this.getView().byId("idVizFrame2Receiving").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrame2Receiving").getDataset().getBinding("data").refresh(true);
				// Filter data source Channel Distribution
				this.getView().byId("idVizFrame3Receiving").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrame3Receiving").getDataset().getBinding("data").refresh(true);
			}
		},

		/**
		 * TO DO
		 */
		applyFilterOrderSending: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				// Call Codex Back-End
				var oFilters = this.getFilterFields();
				// Filter data source Error Tracking Unit
				this.getView().byId("idVizFrameOrderSend").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrameOrderSend").getDataset().getBinding("data").refresh(true);
				// Filter data source Monitoring Status
				this.getView().byId("idVizFrameOrderSend1").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrameOrderSend1").getDataset().getBinding("data").refresh(true);
				// Filter data source Performance Evolution Unit
				this.getView().byId("idVizFrameOrderSend2").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrameOrderSend2").getDataset().getBinding("data").refresh(true);
				// Filter data source Channel Distribution
				this.getView().byId("idVizFrameOrderSend3").getDataset().getBinding("data").filter([oFilters]);
				this.getView().byId("idVizFrameOrderSend3").getDataset().getBinding("data").refresh(true);
			}
		},

		/**
		 * TO DO
		 */
		getFilterFields: function () {
			var aCompanyCode = [];
			var aBusinesUnit = [];
			var oDateFrom;
			var oDateTo;

			// Company Code
			var aCompanySelected = this.getView().byId("listCompanyCode").getSelectedKeys();
			aCompanySelected.forEach(function (element) {
				aCompanyCode.push(new Filter("CompanyCode", FilterOperator.EQ, element));
			});

			var oCompanyCodeFilter = new Filter({
				filters: aCompanyCode,
				and: false
			});

			// Busines Unit
			var aBusinesUnitSelected = this.getView().byId("listBusinesUnit").getSelectedKeys();
			if (aBusinesUnitSelected.length > 0) {
				aBusinesUnitSelected.forEach(function (element) {
					aBusinesUnit.push(new Filter("BusinesUnit", FilterOperator.EQ, element));
				});

				if (aBusinesUnitSelected.length > 0) {
					var oBusinesUnitFilter = new Filter({
						filters: aBusinesUnit,
						and: false
					});
				}
			} else {
				oBusinesUnitFilter = new Filter("BusinesUnit", FilterOperator.EQ, "*");
			}

			// Date From & To
			//var dDateFrom = this.getView().byId("dateFrom").getValue();
			//var dDateTo = this.getView().byId("dateTo").getValue();

			var vSelectedYear = this.getView().byId("listYear").getSelectedKey();
			//var dUnformatedDateFrom = new Date(dDateFrom);
			//var dUnformatedDateTo = new Date(dDateTo);
			var dUnformatedDateFrom = new Date(vSelectedYear, 0, 2);
			var dUnformatedDateTo = new Date(vSelectedYear, 11, 31);

			oDateFrom = new Filter("DateFrom", FilterOperator.EQ, dUnformatedDateFrom);
			oDateTo = new Filter("DateTo", FilterOperator.EQ, dUnformatedDateTo);

			return new Filter({
				filters: [oCompanyCodeFilter, oBusinesUnitFilter, oDateFrom, oDateTo],
				and: true
			});
			//return [aCompanyCode, oDateFrom, oDateTo, "AND"];
		},

		/**
		 * TO DO
		 */
		checkMandatoryFields: function () {

			var vDivision = false;
			//var vDatesCheck = false;
			// var aDivisionSelected = this.getView().byId("listDivision").getSelectedKeys();
			var vDivisionSelected = this.getView().byId("listDivision").getSelectedKey();
			// if (aDivisionSelected !== undefined && aDivisionSelected.length > 0) {
			if (vDivisionSelected !== undefined && vDivisionSelected.length > 0) {
				// DO NOTHING
				vDivision = true;
				this.getView().byId("listDivision").setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
			} else {
				// Change State
				vDivision = false;
				this.getView().byId("listDivision").setValueState(sap.ui.core.ValueState.Error); // if the field is empty after change, it will go red
			}

			var vPole = false;
			//var vDatesCheck = false;
			//var aPoleSelected = this.getView().byId("listPole").getSelectedKeys();
			var vPoleSelected = this.getView().byId("listPole").getSelectedKey();
			//if (aPoleSelected !== undefined && aPoleSelected.length > 0) {
			if (vPoleSelected !== undefined && vPoleSelected.length > 0) {
				// DO NOTHING
				vPole = true;
				this.getView().byId("listPole").setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
			} else {
				// Change State
				vPole = false;
				this.getView().byId("listPole").setValueState(sap.ui.core.ValueState.Error); // if the field is empty after change, it will go red
			}

			var vCompanyCode = false;
			//var vDatesCheck = false;
			var aCompanySelected = this.getView().byId("listCompanyCode").getSelectedKeys();
			if (aCompanySelected !== undefined && aCompanySelected.length > 0) {
				// DO NOTHING
				vCompanyCode = true;
				this.getView().byId("listCompanyCode").setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
			} else {
				// Change State
				vCompanyCode = false;
				this.getView().byId("listCompanyCode").setValueState(sap.ui.core.ValueState.Error); // if the field is empty after change, it will go red
			}

			// Check date from < date to
			/*			var dDateFrom = this.getView().byId("dateFrom").getValue();
						var dDateTo = this.getView().byId("dateTo").getValue();
						var dUnformatedDateFrom = new Date(dDateFrom);
						var dUnformatedDateTo = new Date(dDateTo);

						if ((dUnformatedDateTo.getTime()) > (dUnformatedDateFrom.getTime())) {
							vDatesCheck = true;
							this.getView().byId("dateFrom").setValueState(sap.ui.core.ValueState.None);
							this.getView().byId("dateTo").setValueState(sap.ui.core.ValueState.None);
						} else {
							vDatesCheck = false;
							this.getView().byId("dateFrom").setValueState(sap.ui.core.ValueState.Error);
							this.getView().byId("dateTo").setValueState(sap.ui.core.ValueState.Error);
						}

						if (vCompanyCode === true && vDatesCheck === true) {
							return true;
						} else {
							return false;
						}*/

			if (vCompanyCode === true && vDivision === true && vPole === true) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * TO DO
		 */
		onCustomActionErrorTrackSendingPress: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				//this._showMessageToast("Custom action press event - " + event);
				this.setGlobalFilters(this.getFilterFields());
				// Navigate to Detail View
				this.getRouter().navTo("Route_InvoiceSendErrTrack");
			}
		},

		/**
		 * TO DO
		 */
		onCustomActionErrorTrackReceivingPress: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				//this._showMessageToast("Custom action press event - " + event);
				this.setGlobalFilters(this.getFilterFields());
				// Navigate to Detail View
				this.getRouter().navTo("Route_InvoiceReceivingErrTrack");
			}
		},

		/**
		 * TO DO
		 */
		onCustomActionErrorTrackOrderSendingPress: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				//this._showMessageToast("Custom action press event - " + event);
				this.setGlobalFilters(this.getFilterFields());
				// Navigate to Detail View
				this.getRouter().navTo("Route_OrderSendingErrTrack");
			}
		},

		/**
		 * TO DO
		 */
		onCustomActionPerfEvolutionSendPress: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				//this._showMessageToast("Custom action press event - " + event);
				this.setGlobalFilters(this.getFilterFields());
				// Navigate to Detail View
				this.getRouter().navTo("Route_InvoiceSendPerfEvolution");
			}
		},

		/**
		 * TO DO
		 */
		onCustomActionPerfEvolutionReceivingPress: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				//this._showMessageToast("Custom action press event - " + event);
				this.setGlobalFilters(this.getFilterFields());
				// Navigate to Detail View
				this.getRouter().navTo("Route_InvoiceReceivingPerfEvolution");
			}
		},

		/**
		 * TO DO
		 */
		onCustomActionPerfEvolutionOrderSendPress: function (event) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				//this._showMessageToast("Custom action press event - " + event);
				this.setGlobalFilters(this.getFilterFields());
				// Navigate to Detail View
				this.getRouter().navTo("Route_OrderSendPerfEvolution");
			}
		},

		/**
		 * TO DO
		 */
		onCustomActionPress: function (event) {

		},

		/**
		 * TO DO
		 */
		onCustomExportTrackSendingPress: function (oEvent) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				var oModelData = this.getOwnerComponent().getModel();
				//oModelData.setSizeLimit("2000");
				var aFilters = [];
				aFilters = this.getFilterFields();
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
						path: "/dErrorTrackingInvoiceSendSet",
						filters: aFilters // [this.getGlobalFilters()]
							/*					parameters: {
													expand: "ServiceRequestParty",
													select: "ServiceRequestParty/RoleCode,ServiceRequestParty/FormattedName"
												},*/
							//sorter: aSorter
					},

					// column definitions with column name and binding info for the content
					columns: [{
							name: this.getResourceBundle().getText("txtIsErrorProcessed"),
							template: {
								content: "{IsErrorProcessed}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCompanyCode"),
							template: {
								content: "{CompanyCode}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCompanyCodeDescription"),
							template: {
								content: "{CompanyCodeText}"
							}
						}, {
							name: this.getResourceBundle().getText("txtAnalyticalUnit"),
							template: {
								content: "{AnalyticalUnit}"
							}
						}, {
							name: this.getResourceBundle().getText("txtAnalyticalUnitDescription"),
							template: {
								content: "{AnalyticalUnitText}"
							}
						}, {
							name: this.getResourceBundle().getText("txtDocumentNumber"),
							template: {
								content: "{DocumentNumber}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCanal"),
							template: {
								content: "{Canal}"
							}
						}, {
							name: this.getResourceBundle().getText("txtBusinesPartner"),
							template: {
								content: "{BusinesPartner}"
							}
						}, {
							name: this.getResourceBundle().getText("txtBusinesPartnerName"),
							template: {
								content: "{BusinesPartnerName}"
							}
						}, {
							name: this.getResourceBundle().getText("txtUserResp"),
							template: {
								content: "{UserRespName}"
							}
						}, {
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
						/*{
						name: this.getResourceBundle().getText("txtDaysInError"),
						template: {
							content: {
								parts: ["DateError"],
								formatter: function (dDateProcess) {
									if (dDateProcess) {
										var dDateToday = new Date();
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
					}*/
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
						}, {
							name: this.getResourceBundle().getText("txtInvoiceStatus"),
							template: {
								content: "{InvoiceStatus}"
							}
						}, {
							name: this.getResourceBundle().getText("txtDescriptionError"),
							template: {
								content: "{DescriptionError}"
							}
						}
					]
				});

				// download exported file
				oExport.saveFile().catch(function (oError) {
					//MessageBox.error(this.getResourceBundle().getText("ErrorFile") + "\n\n" + oError);
					//this._showMessageToast("Error read data");
				}).then(function () {
					oExport.destroy();
				});
			}
		},

		/**
		 * TO DO
		 */
		onCustomExportTrackReceivingPress: function (oEvent) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				var oModelData = this.getOwnerComponent().getModel();
				//oModelData.setSizeLimit("2000");
				var aFilters = [];
				aFilters = this.getFilterFields();
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
						path: "/dErrorTrackingInvoiceReceivingSet",
						filters: aFilters // [this.getGlobalFilters()]
							/*					parameters: {
													expand: "ServiceRequestParty",
													select: "ServiceRequestParty/RoleCode,ServiceRequestParty/FormattedName"
												},*/
							//sorter: aSorter
					},

					// column definitions with column name and binding info for the content
					columns: [{
							name: this.getResourceBundle().getText("txtIsErrorProcessed"),
							template: {
								content: "{IsErrorProcessed}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCompanyCode"),
							template: {
								content: "{CompanyCode}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCompanyCodeDescription"),
							template: {
								content: "{CompanyCodeText}"
							}
						}, {
							name: this.getResourceBundle().getText("txtAnalyticalUnit"),
							template: {
								content: "{AnalyticalUnit}"
							}
						}, {
							name: this.getResourceBundle().getText("txtAnalyticalUnitDescription"),
							template: {
								content: "{AnalyticalUnitText}"
							}
						}, {
							name: this.getResourceBundle().getText("txtDocumentNumber"),
							template: {
								content: "{DocumentNumber}"
							}
						}, {
							name: this.getResourceBundle().getText("txtIdocID"),
							template: {
								content: "{IdocId}"
							}
						}, {
							name: this.getResourceBundle().getText("txtScanID"),
							template: {
								content: "{ScanId}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCanal"),
							template: {
								content: "{Canal}"
							}
						}, {
							name: this.getResourceBundle().getText("txtBusinesPartnerSupplier"),
							template: {
								content: "{BusinesPartner}"
							}
						}, {
							name: this.getResourceBundle().getText("txtBusinesPartnerSupplier"),
							template: {
								content: "{BusinesPartnerName}"
							}
						}, {
							name: this.getResourceBundle().getText("txtUserResp"),
							template: {
								content: "{UserRespName}"
							}
						}, {
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
						/*{
						name: this.getResourceBundle().getText("txtDaysInError"),
						template: {
							content: {
								parts: ["DateError"],
								formatter: function (dDateProcess) {
									if (dDateProcess) {
										var dDateToday = new Date();
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
					}*/
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
						}, {
							name: this.getResourceBundle().getText("txtInvoiceStatus"),
							template: {
								content: "{InvoiceStatus}"
							}
						}, {
							name: this.getResourceBundle().getText("txtDescriptionError"),
							template: {
								content: "{DescriptionError}"
							}
						}
					]
				});

				// download exported file
				oExport.saveFile().catch(function (oError) {
					//MessageBox.error(this.getResourceBundle().getText("ErrorFile") + "\n\n" + oError);
					//this._showMessageToast("Error read data");
				}).then(function () {
					oExport.destroy();
				});
			}
		},

		/**
		 * TO DO
		 */
		onCustomExportTrackOrderSendingPress: function (oEvent) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				var oModelData = this.getOwnerComponent().getModel();
				//oModelData.setSizeLimit("2000");
				var aFilters = [];
				aFilters = this.getFilterFields();
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
						path: "/dErrorTrackingOrderSendSet",
						filters: aFilters // [this.getGlobalFilters()]
							/*					parameters: {
													expand: "ServiceRequestParty",
													select: "ServiceRequestParty/RoleCode,ServiceRequestParty/FormattedName"
												},*/
							//sorter: aSorter
					},

					// column definitions with column name and binding info for the content
					columns: [{
							name: this.getResourceBundle().getText("txtIsErrorProcessed"),
							template: {
								content: "{IsErrorProcessed}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCompanyCode"),
							template: {
								content: "{CompanyCode}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCompanyCodeDescription"),
							template: {
								content: "{CompanyCodeText}"
							}
						}, {
							name: this.getResourceBundle().getText("txtAnalyticalUnit"),
							template: {
								content: "{AnalyticalUnit}"
							}
						}, {
							name: this.getResourceBundle().getText("txtAnalyticalUnitDescription"),
							template: {
								content: "{AnalyticalUnitText}"
							}
						}, {
							name: this.getResourceBundle().getText("txtOrderNumber"),
							template: {
								content: "{DocumentNumber}"
							}
						}, {
							name: this.getResourceBundle().getText("txtCanal"),
							template: {
								content: "{Canal}"
							}
						}, {
							name: this.getResourceBundle().getText("txtBusinesPartnerSupplier"),
							template: {
								content: "{BusinesPartner}"
							}
						}, {
							name: this.getResourceBundle().getText("txtBusinesPartnerSupplierName"),
							template: {
								content: "{BusinesPartnerName}"
							}
						}, {
							name: this.getResourceBundle().getText("txtUserResp"),
							template: {
								content: "{UserRespName}"
							}
						}, {
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
						/*{
						name: this.getResourceBundle().getText("txtDaysInError"),
						template: {
							content: {
								parts: ["DateError"],
								formatter: function (dDateProcess) {
									if (dDateProcess) {
										var dDateToday = new Date();
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
					}*/
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
						}, {
							name: this.getResourceBundle().getText("txtInvoiceStatus"),
							template: {
								content: "{InvoiceStatus}"
							}
						}, {
							name: this.getResourceBundle().getText("txtDescriptionError"),
							template: {
								content: "{DescriptionError}"
							}
						}
					]
				});

				// download exported file
				oExport.saveFile().catch(function (oError) {
					//MessageBox.error(this.getResourceBundle().getText("ErrorFile") + "\n\n" + oError);
					//this._showMessageToast("Error read data");
				}).then(function () {
					oExport.destroy();
				});
			}
		},

		/**
		 * TO DO
		 */
		onCustomExportPerfEvolutionSendPress: function (oEvent) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				var oModelData = this.getOwnerComponent().getModel();
				//oModelData.setSizeLimit("2000");
				var aFilters = [];
				aFilters = this.getFilterFields();
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
						path: "/dPerfEvolInvoiceSendSet",
						filters: aFilters // [this.getGlobalFilters()]
							/*					parameters: {
													expand: "ServiceRequestParty",
													select: "ServiceRequestParty/RoleCode,ServiceRequestParty/FormattedName"
												},*/
							//sorter: aSorter
					},

					// column definitions with column name and binding info for the content
					columns: [{
						name: this.getResourceBundle().getText("txtTitleChannel"),
						template: {
							content: "{Tool}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth01"),
						template: {
							content: "{MonthSum01}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth02"),
						template: {
							content: "{MonthSum02}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth03"),
						template: {
							content: "{MonthSum03}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth04"),
						template: {
							content: "{MonthSum04}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth05"),
						template: {
							content: "{MonthSum05}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth06"),
						template: {
							content: "{MonthSum06}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth07"),
						template: {
							content: "{MonthSum07}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth08"),
						template: {
							content: "{MonthSum08}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth09"),
						template: {
							content: "{MonthSum09}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth10"),
						template: {
							content: "{MonthSum10}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth11"),
						template: {
							content: "{MonthSum11}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth12"),
						template: {
							content: "{MonthSum12}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleTotal"),
						template: {
							content: "{TotalTool}"
						}
					}]
				});

				// download exported file
				oExport.saveFile().catch(function (oError) {
					//MessageBox.error(this.getResourceBundle().getText("ErrorFile") + "\n\n" + oError);
					//this._showMessageToast("Error read data");
				}).then(function () {
					oExport.destroy();
				});
			}
		},

		/**
		 * TO DO
		 */
		onCustomExportPerfEvolutionReceivingPress: function (oEvent) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				var oModelData = this.getOwnerComponent().getModel();
				//oModelData.setSizeLimit("2000");
				var aFilters = [];
				aFilters = this.getFilterFields();
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
						path: "/dPerfEvolInvoiceReceivingSet",
						filters: aFilters // [this.getGlobalFilters()]
							/*					parameters: {
													expand: "ServiceRequestParty",
													select: "ServiceRequestParty/RoleCode,ServiceRequestParty/FormattedName"
												},*/
							//sorter: aSorter
					},

					// column definitions with column name and binding info for the content
					columns: [{
						name: this.getResourceBundle().getText("txtTitleChannel"),
						template: {
							content: "{Tool}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth01"),
						template: {
							content: "{MonthSum01}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth02"),
						template: {
							content: "{MonthSum02}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth03"),
						template: {
							content: "{MonthSum03}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth04"),
						template: {
							content: "{MonthSum04}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth05"),
						template: {
							content: "{MonthSum05}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth06"),
						template: {
							content: "{MonthSum06}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth07"),
						template: {
							content: "{MonthSum07}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth08"),
						template: {
							content: "{MonthSum08}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth09"),
						template: {
							content: "{MonthSum09}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth10"),
						template: {
							content: "{MonthSum10}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth11"),
						template: {
							content: "{MonthSum11}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth12"),
						template: {
							content: "{MonthSum12}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleTotal"),
						template: {
							content: "{TotalTool}"
						}
					}]
				});

				// download exported file
				oExport.saveFile().catch(function (oError) {
					//MessageBox.error(this.getResourceBundle().getText("ErrorFile") + "\n\n" + oError);
					//this._showMessageToast("Error read data");
				}).then(function () {
					oExport.destroy();
				});
			}
		},

		/**
		 * TO DO
		 */
		onCustomExportPerfEvolutionOrderSendPress: function (oEvent) {
			// Check Mandatory selection fields 
			if (this.checkMandatoryFields() === true) {
				var oModelData = this.getOwnerComponent().getModel();
				//oModelData.setSizeLimit("2000");
				var aFilters = [];
				aFilters = this.getFilterFields();
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
						path: "/dPerfEvolOrderSendSet",
						filters: aFilters // [this.getGlobalFilters()]
							/*					parameters: {
													expand: "ServiceRequestParty",
													select: "ServiceRequestParty/RoleCode,ServiceRequestParty/FormattedName"
												},*/
							//sorter: aSorter
					},

					// column definitions with column name and binding info for the content
					columns: [{
						name: this.getResourceBundle().getText("txtTitleChannel"),
						template: {
							content: "{Tool}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth01"),
						template: {
							content: "{MonthSum01}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth02"),
						template: {
							content: "{MonthSum02}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth03"),
						template: {
							content: "{MonthSum03}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth04"),
						template: {
							content: "{MonthSum04}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth05"),
						template: {
							content: "{MonthSum05}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth06"),
						template: {
							content: "{MonthSum06}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth07"),
						template: {
							content: "{MonthSum07}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth08"),
						template: {
							content: "{MonthSum08}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth09"),
						template: {
							content: "{MonthSum09}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth10"),
						template: {
							content: "{MonthSum10}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth11"),
						template: {
							content: "{MonthSum11}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleMonth12"),
						template: {
							content: "{MonthSum12}"
						}
					}, {
						name: this.getResourceBundle().getText("txtTitleTotal"),
						template: {
							content: "{TotalTool}"
						}
					}]
				});

				// download exported file
				oExport.saveFile().catch(function (oError) {
					//MessageBox.error(this.getResourceBundle().getText("ErrorFile") + "\n\n" + oError);
					//this._showMessageToast("Error read data");
				}).then(function () {
					oExport.destroy();
				});
			}
		},
		onContentChanged: function (event) {
			//MessageToast.show("Changed Content");
			//this.byId("idProductsTable").getBinding("items").refresh(true);  

			/*			this.byId("idProductsTable").getBinding("items").refresh();
						this.byId("idProductsTable").setGrowing(true);
						this.byId("idProductsTable").setGrowingThreshold(2);
						this.byId("idProductsTable").setGrowingScrollToLoad(false);		*/
			MessageToast.show("oo");
		},

		onSelectData: function (event) {
			this._showMessageToast("Custom action press event - " + event.getSource().getId());
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.vesi.ZFIOAAN_PROJ_DISP.view.Content
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.vesi.ZFIOAAN_PROJ_DISP.view.Content
		 */
		onAfterRendering: function () {

		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.vesi.ZFIOAAN_PROJ_DISP.view.Content
		 */
		//	onExit: function() {
		//
		//	}

	});

});
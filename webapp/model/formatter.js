sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";

	return {
		numPercentFormatter: function (sValue) {
			var iValueInNum;
			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oFormatOptions = {
				minIntegerDigits: 1,
				maxIntegerDigits: 10,
				minFractionDigits: 2,
				maxFractionDigits: 2
			};

			if (sValue !== null && sValue !== "" && sValue !== undefined) {
				if (sValue.toString().endsWith("-")) {
					var sFormattedValue = sValue.replace("-", "");
					iValueInNum = Number(sFormattedValue) * -1;
				} else {
					iValueInNum = Number(sValue);
				}
				var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);

				return (oFloatFormat.format(iValueInNum)) + "%";
			}

			return "";
		},
				stateFormter: function(sVal){
		
				if (sVal === undefined) {
						return "None"; 
				}
				else if (sVal.toString().endsWith("-")) {
					return "Error";	
					
				} 
					return "None"; 
				
				
		},
		numberFormatter: function (sValue, sID, sValueH, sColumn, type) {
			var iValueInNum;
			var sHours = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("tableEVhindex");
			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oFormatOptions = {
				minIntegerDigits: 1,
				maxIntegerDigits: 10,
				minFractionDigits: 2,
				maxFractionDigits: 2
			};

			var aIdsToHide = ["0047", "0048", "0050", "0053", "0099", "0100"];
			var aColumnsToHideForEncDec = ["columnTodo", "columnFinal", "columnPrevious", "columnVariance"];

			if (sID === "0012") {
				sValue = sValueH;
			}

			if (aColumnsToHideForEncDec.indexOf(sColumn) !== -1) {
				if (sID === "0062" || sID === "0063") {
					return "";
				}
			}

			if (aIdsToHide.indexOf(sID) !== -1 && sColumn !== "columnFinal") {
				return "";
			}

			if (sValue !== null && sValue !== "" && sValue !== undefined) {

				if (sValue.toString().endsWith("-")) {
					var sFormattedValue = sValue.replace("-", "");
					iValueInNum = Number(sFormattedValue) * -1;
				} else {
					iValueInNum = Number(sValue);
				}
				var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
				if (type === "H") {
					return oFloatFormat.format(iValueInNum) + " " + sHours;
				} else {
					return oFloatFormat.format(iValueInNum);
				}

			}
			return "";
		},

		numFormatter: function (sValue) {
			var iValueInNum;
			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oFormatOptions = {
				minIntegerDigits: 1,
				maxIntegerDigits: 10,
				minFractionDigits: 2,
				maxFractionDigits: 2
			};
			if (sValue.endsWith("%")) {
				var sFlagP = true;
				sValue = sValue.substring(0, sValue.length - 1);
			};

			if (sValue !== null && sValue !== "" && sValue !== undefined) {
				if (sValue.toString().endsWith("-")) {
					var sFormattedValue = sValue.replace("-", "");
					iValueInNum = Number(sFormattedValue) * -1;
				} else {
					iValueInNum = Number(sValue);
				}
				var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
				if (sFlagP) {
					return (oFloatFormat.format(iValueInNum)) + "%";
				} else {
					return oFloatFormat.format(iValueInNum);
				}

			}

			return "";
		},
		setStrech: function (bFullScreen) {
			if (bFullScreen) {
				return "sap-icon://exit-full-screen";
			}

			return "sap-icon://full-screen";
		},

		isLinkEnabled: function (sID, sColumn, sEntityset) {
			if ( /*sID === "0024" &&*/ sColumn === "columnClosed" && sEntityset) {
				return true;
			}

			return false;
		},

		isItemEnabled: function (sEntitySet) {
			if (sEntitySet) {
				return "Active";
			}

			return "Inactive";
		},

		isBold: function (sCategory) {
			if (sCategory === "T") {
				return "Bold";
			}
			return "Standard";
		},

		formatTextTaux: function (sCategory, sType, sDescription, sTaux, sPrctFrais) {
			if (sCategory === "F") {
				return sDescription + " - " + sPrctFrais;
			} else if (sCategory === "" && sType === "H") {
				return sDescription + " - " + sTaux;
			} else if (sCategory === "" && sType === "M") {
				return sDescription;
			} else if (sCategory === "T" || sCategory === "C") {
				return sDescription;
			}
			if (sDescription) {
				return sDescription;
			}

			return "";

		},
		dateConversion: function (sFullDate, sIDUnique) {
			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oFormatOptions = {
				minIntegerDigits: 2,
				maxIntegerDigits: 2,
				minFractionDigits: 0,
				maxFractionDigits: 0
			};
			var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			if (sIDUnique === "T") {
				var totalText = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("tableMaterialBreakdownTotal");
				return totalText;
			} else if (sFullDate === null || sFullDate === undefined) {
				return "";
			} else {
				var sYear = sFullDate.getUTCFullYear();
				var sMonth = oFloatFormat.format(sFullDate.getMonth()+1);
				var sDates = oFloatFormat.format(sFullDate.getDate());
					

				var StringDate = sDates + "." + sMonth + "." + sYear;
				return StringDate;
			}
		},
		numberDifference: function (sFinal, sLastVE) {
			var fFinal, fLastVE;
			if (sFinal.toString().endsWith("-")) {
				var sFormattedValue = sFinal.replace("-", "");
				fFinal = Number(sFormattedValue) * -1;
			} else {
				fFinal = parseFloat(sFinal);
			}

			if (sLastVE.toString().endsWith("-")) {
				var sFormattedValue = sLastVE.replace("-", "");
				fLastVE = Number(sFormattedValue) * -1;
			} else {
				fLastVE = parseFloat(sLastVE);
			}

			var fDiff = fFinal - fLastVE;

			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oFormatOptions = {
				minIntegerDigits: 1,
				maxIntegerDigits: 9,
				minFractionDigits: 2,
				maxFractionDigits: 2
			};
			var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			return oFloatFormat.format(fDiff);

		},
		hourTotalFormatter: function (sSection, sIDUnique) {
			if(sIDUnique === "T"){
				return "Total";
			}
			return sSection;
		}
	};
		
		
});
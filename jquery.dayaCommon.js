;
(function($) {
	/***************************************************************************
	 * 得到URL参数的值
	 */
	$.URLParams = function(param) {
		var params = {};
		var uri = window.location.toString().split("?");
		if (!uri[1]) return null;
		uri = uri[1].split("#")[0];
		var paramSet = uri.split("&");
		var temp = [];
		for (index in paramSet) {
			temp = paramSet[index].split("=");
			params[temp[0]] = temp[1];
		}

		if (param) {
			if (params[param]) return params[param];
			else return null;
		} else {
			return params;
		}
	}; // URLParams
	/**
	 * 得到用户浏览器的默认语言
	 */
	$.getUserlanguage = function() {
		var baseLange = '';
		if (navigator.userLanguage) {
			baseLang = navigator.userLanguage.substring(0, 2).toLowerCase();
		} else {
			baseLang = navigator.language.substring(0, 2).toLowerCase();
		}
		return baseLang;
	};

})(jQuery);

/**
 * 验证器
 */
var DyValidator = {
	emailRegx: /\w{3,}@\w+(\.\w+)+$/,
	// 中文
	chineseRegx: /[\u4e00-\u9fa5]/,
	// 正实数
	floatingPositiveRegx: /^(0|[1-9]\d*)(\.\d*)?$/,
	// 正整数
	positiveInteger: /^[1-9]\d*$/,
	// 中国电话号码(包括移动和固定电话)
	phoneNumberRegx: /(^(\d{2,4}[-_－—]?)?\d{3,8}([-_－—]?\d{3,8})?([-_－—]?\d{1,7})?$)|(^0?1[35]\d{9}$)/,
	// 移动电话
	mobilPhoneRegx: /^(?:13\d|15\d)\d{5}(\d{3}|\*{3})$/,
	// 家用电话
	phoneRegx: /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/,
	//验证年份
	yearRegx: /^([1-2]\d{3})$/,

	isEmail: function(which) {
		return this.emailRegx.test(which);
	},
	isNotEmail: function(which) {
		return !this.emailRegx.test(which);
	},
	isPositiveInteger: function(which) {
		return this.positiveInteger.test(which);
	},
	isNotPositiveInteger: function(which) {
		return !this.positiveInteger.test(which);
	},
	isPhoneNumber: function(which) {
		return this.phoneNumberRegx.test(which);
	},
	isNotPhoneNumber: function(which) {
		return !this.phoneNumberRegx.test(which);
	},
	isYear: function(which) {
		return !this.yearRegx.test(which);
	}
};
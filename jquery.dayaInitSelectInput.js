/*******************************************************************************
 * 初始化Select标签, URL返回的JSON数据应该包含results字段 howToShowOption : 如何显示选项
 */
$.fn.initSelectInput = function(getDataURL, howToShowOption, initOptionValue,
		options) {
	var settings = $.extend({
		allowNoneSelect : true,
		noneSelectMsg : '',
		changeEventCallback:function(){}
	}, options || {});

	var self = this;

	main();

	function main() {
		var data = {};
		$.getJSON(getDataURL, function(json) {
			data = json.results;
		});
		if (settings.allowNoneSelect) {
			$(self).prepend('<option>' + settings.noneSelectMsg + '</option>');
		}
		if (data) {
			$.each(data, function(index, each) {
				var option = howToShowOption(index, each);
				if (option) {
					$(self).append(option);
				}
			});
			if (initOptionValue != undefined) {
				$(self).get(0).value = initOptionValue;
			}
			$(self).change(settings.changeEventCallback);
		}
	}
	;
};
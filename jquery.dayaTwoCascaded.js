/*******************************************************************************
 * 两级级联表单
 */

$.fn.twoCascaded = function(options) {
	var settings = $.extend({
		parentURL : '',
		// 一级下拉框请求数据的URL string
		parentPostName : '',
		// 一级下拉框的name属性值 string
		howToshowParentOption : '',
		// 如果显示下拉选项 function(index,
		// element){return ''};
		allowParentNoneSelect : true,
		noneParentSelectMsg : '',
		noneParentData : function() {
			return '加载数据失败';
		},

		childURL : '',
		childPostName : '',
		howToshowChildOption : '',
		allowChildNoneSelect : true,
		noneChildSelectMsg : '',
		noneChildData : function() {
			return '加载数据失败';
		},

		saltClass : '',
		saltStyle : ''
	}, options || {});

	var parentURL = settings.parentURL;
	var parentPostName = settings.parentPostName;
	var howToshowParentOption = settings.howToshowParentOption;
	var childURL = settings.childURL;
	var childPostName = settings.childPostName;
	var howToshowChildOption = settings.howToshowChildOption;

	var self = this;
	var container = $('<div class="twoCascaded"></div>');
	var errorMsgContainer = $('<div></div>').addClass('errorMsgContainer');
	var parentInput = $('<input/>').attr('type', 'hidden').attr('name',
			parentPostName).addClass('parentInput');
	var childInput = $('<input/>').attr('type', 'hidden').attr('name',
			childPostName).addClass('childInput');
	var parentSelect = createParentSelect();
	var childSelect = createChildSelect();

	var parentData;
	var childData;

	main();

	function main() {
		$(self).append(container);
		initParentSelect();
		container.append(errorMsgContainer).append(parentInput).append(
				childInput);
	}

	function initParentSelect() {
		parentData = getDataFrom(parentURL);
		if ($.isEmptyObject(parentData)) {
			resetErrorMsg(settings.noneParentData());
		} else {
			resetErrorMsg('');
			if (settings.allowParentNoneSelect) {
				parentSelect.append('<option>' + settings.noneParentSelectMsg
						+ '</option>');
			}
			initSelect(parentSelect, parentData, howToshowParentOption);
			container.append(parentSelect);
			parentSelect.change(whenParentSelectChange);
		}

	}

	function appendChildSelect(parentVal) {
		var URL = childURL + parentVal;
		childData = getDataFrom(URL);
		if ($.isEmptyObject(childData)) {
			removeChildSelect();
			resetErrorMsg(settings.noneChildData());
		} else {
			resetErrorMsg('');
			if (settings.allowChildNoneSelect) {
				childSelect.append('<option>' + settings.noneChildSelectMsg
						+ '</option>');
			}
			initSelect(childSelect, childData, howToshowChildOption);
			parentSelect.after(childSelect);
			childSelect.change(whenChildSelectChange);
		}
	}

	function whenParentSelectChange(e) {
		var currentTarget = $(e.currentTarget);
		var val = currentTarget.val();
		if (val == settings.noneParentSelectMsg) {
			clearAllInput();
			removeChildSelect();
		} else {
			setParentInputVal(val);
			appendChildSelect(val);
		}
	}

	function whenChildSelectChange(e) {
		var currentTarget = $(e.currentTarget);
		var val = currentTarget.val();
		if (val == settings.noneChildSelectMsg) {
			removeChildSelect();
		} else {
			setChildInputVal(val);
		}
	}

	function createParentSelect() {
		var result = $('<select class="parentCascaded"></select>').addClass(
				settings.saltClass);
		if (settings.saltStyle != '') {
			result.css(settings.saltStyle);
		}
		return result;
	}

	function createChildSelect() {
		var result = $('<select class="childCascaded"></select>').addClass(
				settings.saltClass);
		if (settings.saltStyle != '') {
			result.css(settings.saltStyle);
		}
		return result;
	}

	function clearAllInput() {
		setParentInputVal('');
		setChildInputVal('');
	}

	function setParentInputVal(val) {
		parentInput.val(val);
	}

	function setChildInputVal(val) {
		childInput.val(val);
	}

	function resetErrorMsg(msg) {
		errorMsgContainer.html(msg);
	}

	function removeChildSelect() {
		setChildInputVal('');
		container.find('.childCascaded').remove();
	}

	function initSelect(whichSelect, data, howToshowOption) {
		$.each(data, function(index, element) {
			whichSelect.append(howToshowOption(index, element));
		});
	}

	// 约定URL返回的JSON包含results

	function getDataFrom(URL) {
		var results = {};
		$.getJSON(URL, function(json) {
			if (!$.isEmptyObject(json.results)) {
				results = json.results;
			}
		});
		return results;
	}

}; // end two

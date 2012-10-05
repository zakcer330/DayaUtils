/*******************************************************************************
 * 地域级联选择 $('#div').initArea();
 * 接收的json数据格式：{"areas":[{"code":"341500","fullName":"安徽省六安市","id":42,"name":"六安市","new":false,"version":1},
 * {"code":"340800","fullName":"安徽省安庆市","id":32,"name":"安庆市","new":false,"version":1} ]}
 * initAreaValue {id : 1, fullName : '广东省广州市'}
 */

$.fn.initArea = function(action, postDataNameArg, options) {
	
	var settings = $.extend({
		initAreaValue: {},
		select: '',
		clazz: "",
		readOnly: false,
		// 是否可编辑
		editText: '编辑',
		cancelEditText: '取消编辑'
	}, options || {});
	var getAreaUrl = action;
	var initValue = settings.initAreaValue;
	var postDataName = postDataNameArg;
	var self = this;

	var container = $('<div ></div>').addClass('areaContainer');
	var fullNameLabel = $('<span></span>').addClass('areaFullName');
	var editBtn = $('<a></a>').html(settings.editText).addClass('areaEdit').attr('href', 'javascript:void(0);');
	var cancelEditBtn = $('<a ></a>').html(settings.cancelEditText).addClass('areaCancelEdit').hide().attr('href', 'javascript:void(0);');
	var provinceSelect = $('<select></select>').addClass('areaProvince').attr('name', Math.random());
	var citySelect = $('<select></select>').addClass('areaCity').attr('name', Math.random());
	var districtSelect = $('<select></select>').addClass('areaDistrict').attr('name', Math.random());
	var waitUploadData = $('<input/>').attr('type', 'hidden').attr('name', postDataName).addClass('uploadDataClass');

	main();

	function main() {
		// view
		container.append(fullNameLabel);
		fullNameLabel.after(waitUploadData);
		$(self).append(container);

		// event
		editBtn.click(whenEditBtnClick);
		cancelEditBtn.click(whenCancelEditBtnClick);

		if (settings.readOnly) {
			appendProvinceSelect();
		} else {
			if ($.isEmptyObject(initValue)) {
				appendProvinceSelect();
			} else {
				initAreaLabelAndInput(initValue);
				container.append(editBtn);
				container.append(cancelEditBtn);
			}
		}
	}

	function whenEditBtnClick(e) {
		$(e.currentTarget).hide();
		cancelEditBtn.show();
		appendProvinceSelect();
	}

	function whenCancelEditBtnClick(e) {
		$(e.currentTarget).hide();
		editBtn.show();
		removeAllSelect();
		fullNameLabel.html(initValue.fullName);
	}

	function initAreaLabelAndInput(initValue) {
		waitUploadData.val(initValue.id);
		fullNameLabel.data('areaId', initValue.id);
		fullNameLabel.html(initValue.fullName);
	}

	function freshFullNameLabel(areaId, areaFullName) {
		fullNameLabel.data('areaId', areaId);
		fullNameLabel.html(areaFullName);
		container.find('.uploadDataClass').val(areaId);
	}

	function whenProvinceSelectChange(e) {
		removeCitySelect();
		removeDistrictSelect();
		var currentTarget = $(e.currentTarget);
		if (currentTarget.val() == settings.select) {
			currentTarget.parent().find('> .beforeProvinceBR:first').remove();
			freshFullNameLabel('', '');
		} else {
			if (currentTarget.parent().find('> .beforeProvinceBR:first').size() == 0) {
				currentTarget.before('<br class="beforeProvinceBR"/>');
			}
			freshFullNameLabel(getSelectVal(provinceSelect), getSelectFullName(provinceSelect));
		}
		appendCitySelect();

	}

	function whenCitySelectChange(e) {
		removeDistrictSelect();
		appendDistrictSelect();
		var currentTarget = $(e.currentTarget);
		if (currentTarget.val() == settings.select) {
			freshFullNameLabel(getSelectVal(provinceSelect), getSelectFullName(provinceSelect));
		} else {
			freshFullNameLabel(getSelectVal(citySelect), getSelectFullName(citySelect));
		}

	}

	function whenDistrictSelectChange(e) {
		var currentTarget = $(e.currentTarget);
		if (currentTarget.val() == settings.select) {
			freshFullNameLabel(getSelectVal(citySelect), getSelectFullName(citySelect));
		} else {
			freshFullNameLabel(getSelectVal(districtSelect), getSelectFullName(districtSelect));
		}
	}

	function appendProvinceSelect() {
		initAreaSelectData(provinceSelect, getAreaUrl);
		container.append(provinceSelect);
		provinceSelect.change(whenProvinceSelectChange);
	}

	function appendCitySelect() {
		if (provinceSelect.val() != settings.select) {
			initAreaSelectData(citySelect, getAreaUrl, provinceSelect.val());
			provinceSelect.after(citySelect);
			citySelect.change(whenCitySelectChange);
		} else {
			removeDistrictSelect();
		}
	}

	function appendDistrictSelect() {
		if (citySelect.val() != settings.select) {
			citySelect.after(districtSelect);
			initAreaSelectData(districtSelect, getAreaUrl, citySelect.val());
			districtSelect.change(whenDistrictSelectChange);
		} else {
			freshFullNameLabel(citySelect);
		}
	}

	function removeAllSelect() {
		removeDistrictSelect();
		removeCitySelect();
		removeProvinceSelect();

	}

	function removeProvinceSelect() {
		container.find('.areaProvince').remove();
	}

	function removeCitySelect() {
		container.find('.areaCity').remove();
	}

	function removeDistrictSelect() {
		container.find('.areaDistrict').remove();
	}

	function isEmpty(select) {
		return select.find('option').size() <= 1;
	}

	function getSelectVal(select) {
		var val = select.get(0).value;
		if (val == settings.select) {
			return '';
		}
		return select.get(0).value;
	}

	function getSelectFullName(select) {
		var isNoneSelect = select.get(0).value == settings.select;
		if (isNoneSelect) {
			return '';
		}
		return select.find('option:selected').data('fullName');
	}

	function initAreaSelectData(whichSelect, areaDataURL, parentAreaId) {
		var data = {};
		if (parentAreaId != undefined) {
			data = {
				'areaId': parentAreaId
			};
		}
		whichSelect.empty();
		whichSelect.append('<option>' + settings.select + '</option>');
		$.post(getAreaUrl, data, function(json) {
			$.each(json.areas, function(i, item) {
				var option = $("<option></option>").val(item.id).html(item.name).data('fullName', item.fullName);
				whichSelect.append(option);
			});
		});
	}
};
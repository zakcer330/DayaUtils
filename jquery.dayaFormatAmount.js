// 将传入参数转化为标准的数字

function convertToNumber(str) {
	str = (str == undefined ? '' : new String(str).toString());
	str = str.replace(/[^\d.]/g, "");
	str = str.replace(/^\./g, "");
	// 保证只有出现一个.而没有多个.
	str = str.replace(/\.{2,}/g, ".");
	// 保证.只出现一次，而不能出现两次以上
	str = str.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	str = str.replace(/,/g, "");
	return str;

}

//将金额123456格式化成123,456
$.createFormatAmount = function(amount) {
	var amountBoo = amount;
	var leftOrigStr = convertToNumber(amountBoo).split(".")[0];
	var rightOrigStr = amountBoo.split(".")[1];

	var leftTargetStr = "";
	// subNumberLength将代表'12,333,444'中'12'的长度,
	// 不懂如何命名, 暂时用这个
	var subNumberLength = leftOrigStr.length % 3;

	var splitLength = (leftOrigStr.length - subNumberLength) / 3;

	if(subNumberLength != 0) {
		var frontNumber = leftOrigStr.substring(0, subNumberLength);
		leftTargetStr += (frontNumber + ",");
	}

	for(var i = 0; i < splitLength; i++) {
		leftTargetStr += (leftOrigStr.substring(subNumberLength, subNumberLength + 3) + ",");
		subNumberLength += 3;
	}

	var leftTargetStrSize = leftTargetStr.length - 1;
	if(amountBoo.split(".")[1] != null) {
		return(leftTargetStr.substring(0, leftTargetStrSize) + "." + rightOrigStr);
	} else {
		return leftTargetStr.substring(0, leftTargetStrSize);
	}

};


/***************************************************************************
 * 将金额123456格式化成123,456 的编辑器
 * 等待升级：可同时添加多个inputElement， 如，$.formatAmount('#a','#b')
 */
$.formatAmount = function(originalElement, saltClass) {
	var originalInput = $(originalElement);
	var newInput = $(originalElement).clone();
	originalInput.after(newInput);

	originalInput.removeAttr('id');
	//如果表单元素没有name属性,jquery.validation无法正常运行.
	var randomName = 'JKJJIJSKNNMNJL' + Math.floor(Math.random() * 10000);
	newInput.attr('name', randomName).addClass(saltClass);

	originalInput.hide();

	var selfFormatAmount = originalInput.next();
	selfFormatAmount.bind('keyup', function(eventObject) {
		var self = selfFormatAmount;
		self.val($.createFormatAmount(self.val()));
		// 将格式化后的字符串中的逗号去掉
		originalInput.val(self.val().split(',').join(''));
	});
	selfFormatAmount.trigger('keyup');

};
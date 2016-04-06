'use strict';
/**
 * Created by waylau.com on 2014/10/15.
 */
/**
 * 弹窗
 */
var msgShow = function (title, msg, showType, timeout, showSpeed, width, height) {
  $.messager.show({
    title: title,
    msg: msg,
    timeout: timeout,
    showSpeed: showSpeed,
    showType: showType,
    width: width,
    heigh: height
  });
};

/**
 * 警告窗 e=error, q=question,i=info,w=warning.
 */
var msgAlert = function (title, msg, icon, fn) {

  if (/^e/.test(icon)) {
    icon = 'error';
  } else if (/^q/.test(icon)) {
    icon = 'question';
  } else if (/^i/.test(icon)) {
    icon = 'info';
  } else if (/^w/.test(icon)) {
    icon = 'warning';
  }

  $.messager.alert(
    title,
    msg,
    icon,
    fn
  );
};

/**
 * 确认窗
 */
var msgConfirm = function (title, msg, fn) {
  $.messager.confirm(
    title,
    msg,
    fn
  );
};

/**
 * 提示窗
 */
var msgPrompt = function (title, msg, fn) {
  $.messager.prompt(
    title,
    msg,
    fn
  );
};

/**
 * 进度条窗
 */
var msgProgress = function (isShow, title, msg, text) {
  if (!isShow) {
    $.messager.progress('close');
    return;
  }
  var win = $.messager.progress({
    title: title,
    msg: msg,
    text: text
  });
};

/**
 * msg error
 * */
var msgValidationError = function (err) {
  var msg = "";
  var validations = err.error_validations;
  if (!validations)
    return;
  var keys = Object.keys(validations);
  if (keys.length) {
    keys.forEach(function (k) {
      msg = msg + k + ":" + validations[k] + "<br/>";
    });
    msgAlert(err.error_message, msg, "i");
  }
}
var msgError = function (err) {

  try {
    var error = JSON.parse(err.responseText);
    if (!error.error_validations) {
      msgAlert(error.error_code, error.error_message, "i");
    } else {
      msgValidationError(err);
    }
  }
  catch (e) {
    msgAlert(err.statusText, "server error,please wait or contact us");
  }

}

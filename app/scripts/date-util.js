/**
 * 时间对象的格式化
 * 用法 ：
 * var time = new Date().format('yyyy-MM-dd hh:mm:ss');
 * 或者
 * var time = new Date().format('yyyy年MM月dd日 hh时mm分ss秒');
 *
 * Created by waylau.com on 2014/8/21.
 * update by waylau.com on 2014-11-7.
 */
 'use strict';
function dateFormatter (val){
  var date = new Date(val);
  return date.format("yyyy-MM-dd hh:mm:ss")
}

Date.prototype.format = function (format) {
    'use strict';
    /*
     * format='yyyy-MM-dd hh:mm:ss';
     */
    var o = {
        'y+': this.getFullYear(),
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),

        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
    };


    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }


    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};

/**
 * convert form to json object
 * $('formId').serializeObject();
 * */
$.fn.serializeObject = function()
{
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};


// url to json
function QueryStringToJSON(location) {
  var pairs = location.search.slice(1).split('&');
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return JSON.parse(JSON.stringify(result));
}

/**
 * json to url encode
 *
 * */
var jsonToUrl = function(json) {
  if (!JSON.stringify(json)) {
    return '';
  }

  var tmps = [];
  for (var key in json) {
    tmps.push(key + '=' + json[key]);
  }

  return tmps.join('&');
}



function pagerFilter(data) {
  if (typeof data.length == 'number' && typeof data.splice == 'function') {	// is array
    data = {
      total: data.length,
      rows: data
    }
  }
  var dg = $(this);
  var opts = dg.datagrid('options');
  var pager = dg.datagrid('getPager');
  pager.pagination({
    onSelectPage: function (pageNum, pageSize) {
      opts.pageNumber = pageNum;
      opts.pageSize = pageSize;
      pager.pagination('refresh', {
        pageNumber: pageNum,
        pageSize: pageSize
      });
      dg.datagrid('loadData', data);
    }
  });
  if (!data.originalRows) {
    data.originalRows = (data.rows);
  }
  var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
  var end = start + parseInt(opts.pageSize);
  data.rows = (data.originalRows.slice(start, end));
  return data;
}

/**
 * get selected row
 * */
function getSelectedRow(dg){
  var row = dg.datagrid('getSelected');
  if (row){
    return row;
  }
}

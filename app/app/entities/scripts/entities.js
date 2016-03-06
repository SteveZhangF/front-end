function getEntities() {
  ajaxLoading('Loading...');
  oauth2.getWithAuth("http://localhost:8080/admin/entities", function (data) {
      $('#entities_grid').datagrid({loadFilter: pagerFilter}).datagrid('loadData', data);
      ajaxLoadEnd();
    },
    function (err) {
      console.log(err);
      ajaxLoadEnd();
      msgAlert(err);
    }
  )
}
var entitiesToolBar = [{
  text: 'refresh',
  iconCls: 'icon-reload',
  handler: function () {
    getEntities();
  }
},
  {
    text: 'add',
    iconCls: 'icon-add',
    handler: function () {
      showCreateEntity();
    }
  },
  {
    text:'edit',
    iconCls: 'icon-edit',
    handler: function () {
      editEntity();
    }
  }
];

function editEntity(){
  var row = getSelectedRow($('#entities_grid'));
  console.log(row)
  addTabContent(row.name+'_'+row.id,'app/entities/edit_entity.html?'+jsonToUrl(row),true);

}


function showCreateEntity(){
  $('#create_entity_win').window('open')
}

//
//function pagerFilter(data) {
//  if (typeof data.length == 'number' && typeof data.splice == 'function') {	// is array
//    data = {
//      total: data.length,
//      rows: data
//    }
//  }
//  var dg = $(this);
//  var opts = dg.datagrid('options');
//  var pager = dg.datagrid('getPager');
//  pager.pagination({
//    onSelectPage: function (pageNum, pageSize) {
//      opts.pageNumber = pageNum;
//      opts.pageSize = pageSize;
//      pager.pagination('refresh', {
//        pageNumber: pageNum,
//        pageSize: pageSize
//      });
//      dg.datagrid('loadData', data);
//    }
//  });
//  if (!data.originalRows) {
//    data.originalRows = (data.rows);
//  }
//  var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
//  var end = start + parseInt(opts.pageSize);
//  data.rows = (data.originalRows.slice(start, end));
//  return data;
//}


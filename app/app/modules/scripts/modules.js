
function createModule(form) {
  ajaxLoading('Loading...');
  oauth2.postAuth("/admin/modules/",form.serializeObject(), function (data) {
      ajaxLoadEnd();
      getModules();
      $('#create_module_win').window('close');
    },
    function (err) {
      console.log(err)
      ajaxLoadEnd();
      msgAlert(err.responseJSON.consumerMessage,err.responseJSON.applicationMessage);
    }
  )
}

function getModules() {
  ajaxLoading('Loading...');
  oauth2.getWithAuth("/admin/modules/", function (data) {
      $('#modules_grid').datagrid({loadFilter: pagerFilter}).datagrid('loadData', data);
      ajaxLoadEnd();
    },
    function (err) {
      console.log(err);
      ajaxLoadEnd();
      msgAlert(err);
    }
  )
}


function editModule(){
  var row = getSelectedRow($('#modules_grid'));
  console.log(row)
  addTabContent(row.name+'_'+row.id,'app/modules/edit_module.html?'+jsonToUrl(row),true);
}


var modulesToolBar = [{
  text: 'refresh',
  iconCls: 'icon-reload',
  handler: function () {
    getModules();
  }
},
  {
    text: 'add',
    iconCls: 'icon-add',
    handler: function () {
      showCreateModule();
    }
  },
  {
    text: 'edit',
    iconCls: 'icon-edit',
    handler: function () {
      editModule();
    }
  }
];

function showCreateModule() {
  $('#create_module_win').window('open')
}

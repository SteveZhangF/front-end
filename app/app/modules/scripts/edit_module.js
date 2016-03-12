var module;
function getModuleDetail() {
  var module = QueryStringToJSON(window.location);
  oauth2.getWithAuth("/admin/modules/" + module.id + "/tree/", function (data) {
      var module = data;
      $('#edit_module_form').form('load', {
        name: module.name,
        description: module.description,
        updateTime: dateFormatter(module.updateTime),
        createTime: dateFormatter(module.createTime),
        id: module.id
      });

      $('#module_tree').tree({
        data: data,
        formatter: function (node) {
          return node.name;
        },
        loadFilter: myLoadFilter,
        //onBeforeExpand: function (node) {
        //  return loadSubNode(node);
        //},
        onClick: function (node) {
          node.onSelect();
        },
        onContextMenu: function (e, node) {
          e.preventDefault();
          // select the node
          node.onSelect();
          // display context menu
          if (node.id && node.type == 'folder')
            $('#folder_context_menu').menu('show', {
              left: e.pageX,
              top: e.pageY
            });
          if (node.id && node.type == "entity")
            $('#entity_context_menu').menu('show', {
              left: e.pageX,
              top: e.pageY
            })
        }
      });
      ajaxLoadEnd();
    }
    ,
    function (err) {
      ajaxLoadEnd();
      msgError(err);
    }
  )
}

/**
 * update the module
 * */
function updateModule() {
  var form = $('#edit_module_form');
  var updatedModule = form.serializeObject();
  oauth2.putWithAuth("/admin/modules/" + updatedModule.id + "/", updatedModule, function (data) {
    ajaxLoadEnd();
    getModuleDetail();
  }, function (err) {
    ajaxLoadEnd();
    msgError(err);
  });
}


function loadSubNode(node) {
  if (node.type == 'folder') {
    return loadSubFolder(node);
  }
}

function removeChildren(node) {
  $("#module_tree").tree('getChildren', node.target).forEach(function (c) {
    $("#module_tree").tree('remove', c.target);
  });
}

function loadSubFolder(node, call_back) {
  node.children = [];
  ajaxLoading();
  oauth2.getWithAuth("/admin/folders/" + node.id + "/sub_folder/", function (data) {
    data.forEach(function (f) {
      f.state = "closed";
      f.onSelect = function () {
        selectFolder(f);
      }
    });
    var folders = data;
    //  /admin/folders/{folderId}/reports/

    oauth2.getWithAuth("/admin/folders/" + node.id + "/reports/", function (data) {
      removeChildren(node);
      data.forEach(function (f) {
        f.onSelect = function () {
          selectReport(f);
        }
        folders.push(f);
      });
      $('#module_tree').tree('append', {
        parent: node.target,
        data: folders
      }).tree('expand', node.target);
      node.state = "open";
      if (typeof (call_back) == "function") {
        call_back(node);
      }
      ajaxLoadEnd();
    }, function (err) {
      ajaxLoadEnd();
      msgError(err);
    });


    //console.log(node);


    ajaxLoadEnd();
  }, function (err) {
    ajaxLoadEnd();
    msgError(err);
  })
}


//
function myLoadFilter(data, parent) {
  if (data.type) {
    if (data.type == "module") {
      var children = [];
      if (data.entities) {
        var entities = {name: "entities", moduleId: data.id, children: data.entities, iconCls: "icon-man"};
        entities.onSelect = function () {
          $('#edit_entity_node').css("display", "none");
          $('#edit_node').css("display", "");
          $('#edit_report_node').css("display", 'none');
          showChildrenInDataGrid(entities);
          taglePropertyForm(false);
        }
        data.entities.forEach(function (e) {
          e.onSelect = function () {
            selectEntity(e);
          }
        });
        children.push(entities);

      }
      if (data.folders) {
        var folders = {name: "folders", moduleId: data.id, children: data.folders};
        data.folders.forEach(function (f) {
          f.state = "closed";
          f.onSelect = function () {
            selectFolder(f);
          }
        });
        folders.onSelect = function () {
          $('#edit_entity_node').css("display", "none");
          $('#edit_node').css("display", "none");
          $('#edit_report_node').css("display", 'none');
          showChildrenInDataGrid(folders);
          taglePropertyForm(false);
        }
        children.push(folders);
      }
      return children;
    } else if (data.type == "folder") {
      data.onSelect = function () {
        console.log(data)
      }
    }
  } else {
    return data;
  }
}

function taglePropertyForm(flag) {
  if (flag) {
    $("#edit_select_folder_form").css("display", "");
  } else {
    $("#edit_select_folder_form").css("display", "none");
  }

}

function selectEntity(f) {
  ajaxLoading();
  taglePropertyForm(true);
  //showChildrenInDataGrid();
  //$('#edit_entity_node').css("display", "");
  //$('#edit_node').css("display", "none");

  $('#edit_entity_node').css("display", "");
  $('#edit_node').css("display", "none");
  $('#edit_report_node').css("display", 'none');

  oauth2.getWithAuth('/admin/entities/' + f.id, function (data) {
    $("#edit_select_entity_form").form('load', {
      name: data.name,
      description: data.description,
      updateTime: dateFormatter(data.updateTime),
      createTime: dateFormatter(data.createTime),
      id: data.id
    });

    $('#entity_field_grid').datagrid({loadFilter: pagerFilter}).datagrid('loadData', data.fields);

    ajaxLoadEnd();
  }, function (err) {
    ajaxLoadEnd();
    msgError(err);
  })
}


/**
 * update
 * */

function updateElement() {

  var oldFolder = getSelectedNode();
  if (oldFolder.type == "folder") {
    updateFolder();
  } else if (oldFolder.type == "entity") {
    updateEntity();
  } else if (!oldFolder.id && oldFolder.name == "entities") {
    createEntity();
  }
}

/**
 * update entity
 * */
function updateEntity() {
  var oldFolder = getSelectedNode();
  console.log(oldFolder);
  ajaxLoading();
  var folder = $("#edit_select_entity_form").serializeObject();

  oldFolder.id = folder.id;
  oldFolder.name = folder.name;
  oldFolder.description = folder.description;
  console.log(oldFolder);
  oldFolder.fields = $('#entity_field_grid').datagrid('getData').rows;
  oauth2.putWithAuth("/admin/entities/" + folder.id + "/", oldFolder, function (data) {

    oldFolder.id = data.id;
    oldFolder.createTime = data.createTime;
    oldFolder.updateTime = data.updateTime;
    oldFolder.description = data.description;
    oldFolder.name = data.name;
    $("#module_tree").tree("update", oldFolder);
    selectEntity(oldFolder);
    ajaxLoadEnd();
  }, function (err) {
    ajaxLoadEnd();
    msgError(err);
  })
}

function createEntity() {
  ajaxLoading();
  var oldFolder = $("#edit_select_entity_form").serializeObject();
  oldFolder.fields = $('#entity_field_grid').datagrid('getData').rows;
  console.log(oldFolder);
  var module = QueryStringToJSON(window.location);
  oauth2.postAuth("/admin/modules/" + module.id + "/entities/", oldFolder, function (data) {
    oldFolder.id = data.id;
    oldFolder.createTime = data.createTime;
    oldFolder.updateTime = data.updateTime;
    oldFolder.description = data.description;
    oldFolder.name = data.name;
    //$("#module_tree").tree("update", oldFolder);
    getModuleDetail();
    ajaxLoadEnd();
  }, function (err) {
    ajaxLoadEnd();
    msgError(err);
  })
}

function selectFolder(f) {
  console.log(f.state);
  $('#edit_entity_node').css("display", "none");
  $('#edit_node').css("display", "");
  $('#edit_report_node').css("display", 'none');
  if (f.state == "open") {
    $("#module_tree").tree('collapse', f.target);
  } else {
    $("#module_tree").tree('getChildren', f.target).forEach(function (c) {
      $("#module_tree").tree('remove', c.target);
    });
    taglePropertyForm(true);
    $("#edit_select_folder_form").form('load', {
      name: f.name,
      description: f.description,
      updateTime: dateFormatter(f.updateTime),
      createTime: dateFormatter(f.createTime),
      id: f.id
    });
    showChildrenInDataGrid(f);
    if (f.state == "closed")
      loadSubFolder(f, showChildrenInDataGrid);
  }

}

function getSelectedNode() {
  return $('#module_tree').tree('getSelected');
}

/**
 * update folder
 * */
function updateFolder() {
  ajaxLoading();
  var folder = $("#edit_select_folder_form").serializeObject();
  //console.log(folder);
  oauth2.putWithAuth("/admin/folders/" + folder.id + "/", folder, function (data) {
    var oldFolder = getSelectedNode();
    oldFolder.id = data.id;
    oldFolder.createTime = data.createTime;
    oldFolder.updateTime = data.updateTime;
    oldFolder.description = data.description;
    oldFolder.name = data.name;
    console.log(oldFolder);
    $("#module_tree").tree("update", oldFolder);
    ajaxLoadEnd();
  }, function (err) {
    ajaxLoadEnd();
    msgError(err);
  })
}

/**
 *
 * showChildrenInDataGrid
 * * */
function showChildrenInDataGrid(node) {
  if (node == undefined) {
    $("#data_grid_div").css("display", "none");
  } else {
    $("#data_grid_div").css("display", "");
    if (node.children) {
      $('#root_folders_grid').datagrid({loadFilter: pagerFilter}).datagrid('loadData', node.children);
    } else {
      $('#root_folders_grid').datagrid({loadFilter: pagerFilter}).datagrid('loadData', []);
    }
  }
}
var root_folders_ToolBar = [
  {
    text: 'add',
    iconCls: 'icon-add',
    handler: function () {
      showAddRootFolder();
    }
  },
  {
    text: 'edit',
    iconCls: 'icon-edit',
    handler: function () {
      editRootFolder();
    }
  }
];

function showAddRootFolder() {
  if (getSelectedNode().type == "folder" || (!getSelectedNode().type && getSelectedNode().name == "folders"))
    $('#create_folder_win').window('open');
  if ((!getSelectedNode().type && getSelectedNode().name == "entities")) {
    //$('#create_entity_win').window('open');
    showAddEntity();
  }

}

function createFolder(f) {
  var folder = f.serializeObject();
  var parentId = getSelectedNode().id;
  if (parentId) {
    oauth2.postAuth('/admin/folders/' + parentId + '/sub_folder/', folder, function (data) {
      selectFolder(getSelectedNode());
      selectFolder(getSelectedNode());
      $('#create_folder_win').window('close');
    }, function (err) {
      ajaxLoadEnd();
      msgError(err);
    })
  } else {
    var moduleId = getSelectedNode().moduleId;
    oauth2.postAuth('/admin/modules/' + moduleId + '/folders/', folder, function (data) {
      getModuleDetail();
      $('#create_folder_win').window('close');
    }, function (err) {
      ajaxLoadEnd();
      msgError(err);
    })
  }
}

function editRootFolder() {
  var selected = $('#root_folders_grid').datagrid('getSelected');
  var selectedNode = $('#module_tree').tree('find', selected.id);
  selectedNode.onSelect();
  $('#module_tree').tree('select', selectedNode.target);
}
/**
 * select folder root node end
 * */

function deleteNode() {
  var node = getSelectedNode();
  if (node.type) {
    if (node.type == "folder") {
      deleteFolder(node);
    }
    if (node.type == "entity") {
      deleteEntity(node);
    }
  }
}

function deleteEntity(entity) {
  ajaxLoading();
  oauth2.deleteWithAuth("/admin/entities/" + entity.id + "/", function (data) {
    ajaxLoadEnd();
    getModuleDetail();
  }, function (err) {
    console.log(err);
    ajaxLoadEnd();
    if (err.status == 200) {
      msgAlert("Success", "Deleted!");
      getModuleDetail();
    } else {
      msgError(err);
    }
  })
}
function showAddReport() {
  var folderId = getSelectedNode().id;
  $('#edit_entity_node').css("display", "none");
  $('#edit_node').css("display", "none");
  $('#edit_report_node').css("display", '');

  $("#edit_select_report_form").form('load', {
    name: '',
    description: '',
    updateTime: '',
    createTime: '',
    folderId: folderId,
    id:undefined
  });
  iniTiny();
  tinyMCE.get('report_content').getBody().innerHTML='';

}

function iniTiny(){
  tinymce.init({
    selector: '#report_content',
    br_in_pre: false,
    height: 400,
    encoding: 'xml',
    extended_valid_elements : 'field[id,name]',
    custom_elements : '~field',
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table contextmenu paste code'
    ],
    toolbar: 'insert_field insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    content_css: [
      '//fast.fonts.net/cssapi/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
      '//www.tinymce.com/css/codepen.min.css'
    ],

    setup: function (editor) {
      editor.addButton('insert_field', {
        text: 'Insert New Field',
        icon: false,
        type: 'menubutton',
        menu: getEntitiesAndFieldForMenu(editor)
      });
    },
  });
}
function selectReport(){
  var report = getSelectedNode();
  $('#edit_entity_node').css("display", "none");
  $('#edit_node').css("display", "none");
  $('#edit_report_node').css("display", '');

  $("#edit_select_report_form").form('load', {
    name: report.name,
    description: report.description,
    updateTime: dateFormatter(report.updateTime),
    createTime: dateFormatter(report.createTime),
    id: report.id,
    folderId: report.folderId
  });
  oauth2.getWithAuth('/admin/reports/'+report.id+"/", function (data) {
    tinyMCE.get('report_content').getBody().innerHTML=data.content;
  }, function (err) {

  });
  iniTiny();

}
function getEntitiesAndFieldForMenu(editor) {
  var root = $("#module_tree").tree('getRoots');
  var entities = root[0].children;
  var menu = []
  entities.forEach(function (entity) {
    var m = {text: entity.name, menu: []};
    entity.fields.forEach(function (field) {
      m.menu.push({
        text: field.name, onclick: function () {
          editor.insertContent("<span style=\"text-decoration: underline;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<field id='" + field.id + "' name='"+entity.name+"_"+field.name+"'></field>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");
        }
      });
    });
    menu.push(m);
  });
  return menu;
}


function updateReport() {
  var report = $("#edit_select_report_form").serializeObject();
  report.content = tinyMCE.get('report_content').getContent();
  console.log(report);
  if (report.id) {

  } else {
    ajaxLoading();
    oauth2.postAuth('/admin/folders/' + report.folderId + '/reports/', report, function (data) {
      ajaxLoadEnd();
    }, function (err) {
      console.log(err);
      ajaxLoadEnd();
      msgError(err);
    })
  }
}

function deleteFolder(folder) {
  ajaxLoading();
  oauth2.deleteWithAuth("/admin/folders/" + folder.id + "/", function (data) {
    ajaxLoadEnd();
    getModuleDetail();
  }, function (err) {
    console.log(err);
    ajaxLoadEnd();
    if (err.status == 200) {

      msgAlert("Success", "Deleted!");
      getModuleDetail();
    } else {
      msgError(err);
    }
  })
}

/**
 *
 * for data grid
 * */

var editIndex = undefined;
function endEditing() {
  if (editIndex == undefined) {
    return true
  }
  if ($('#entity_field_grid').datagrid('validateRow', editIndex)) {
    $('#entity_field_grid').datagrid('endEdit', editIndex);
    editIndex = undefined;
    return true;
  } else {
    return false;
  }
}
function onClickRow(index) {
  if (editIndex != index) {
    if (endEditing()) {
      $('#entity_field_grid').datagrid('selectRow', index)
        .datagrid('beginEdit', index);
      editIndex = index;
    } else {
      $('#entity_field_grid').datagrid('selectRow', editIndex);
    }
  }
}
function append() {
  console.log("adding");
  if (endEditing()) {
    console.log("adding...");

    $('#entity_field_grid').datagrid('appendRow', {id: ''});
    editIndex = $('#entity_field_grid').datagrid('getRows').length - 1;
    $('#entity_field_grid').datagrid('selectRow', editIndex)
      .datagrid('beginEdit', editIndex);
  }
}
function removeit() {
  if (editIndex == undefined) {
    return
  }
  $('#entity_field_grid').datagrid('cancelEdit', editIndex)
    .datagrid('deleteRow', editIndex);
  editIndex = undefined;
}
function accept() {
  if (endEditing()) {
    $('#entity_field_grid').datagrid('acceptChanges');
  }
}
function reject() {
  $('#entity_field_grid').datagrid('rejectChanges');
  editIndex = undefined;
}
function getChanges() {
  var rows = $('#entity_field_grid').datagrid('getChanges');
  alert(rows.length + ' rows are changed!');
}

function showAddEntity() {
  taglePropertyForm(true);
  $('#edit_entity_node').css("display", "");
  $('#edit_node').css("display", "none");
  $('#edit_report_node').css("display", 'none');
  $("#edit_select_entity_form").form('load', {
    name: '',
    description: '',
    updateTime: '',
    createTime: '',
    id: ''
  });
  $('#entity_field_grid').datagrid({loadFilter: pagerFilter}).datagrid('loadData', []);
}
//
//var editIndex = undefined;
//function endEditing(){
//  if (editIndex == undefined){return true}
//  if ($('#entity_field_grid').datagrid('validateRow', editIndex)){
//    var ed = $('#entity_field_grid').datagrid('getEditor', {index:editIndex,field:'id'});
//    var productname = $(ed.target).combobox('getText');
//    $('#entity_field_grid').datagrid('getRows')[editIndex]['name'] = productname;
//    $('#entity_field_grid').datagrid('endEdit', editIndex);
//    editIndex = undefined;
//
//    return true;
//  } else {
//    return false;
//  }
//}
//function fieldOnClickRow(index){
//  if (editIndex != index){
//    if (endEditing()){
//      $('#entity_field_grid').datagrid('selectRow', index)
//        .datagrid('beginEdit', index);
//      editIndex = index;
//    } else {
//      $('#entity_field_grid').datagrid('selectRow', editIndex);
//    }
//  }
//}
//
//
//

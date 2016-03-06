function getModuleDetail() {
  var module = QueryStringToJSON(window.location);


  oauth2.getWithAuth("http://localhost/api/admin/modules/" + module.id + "/tree", function (data) {
      var module = data;
      $('#edit_module_form').form('load', {
        name: module.name,
        description: module.description,
        updateTime: dateFormatter(module.updateTime),
        createTime: dateFormatter(module.createTime)
      });

      $('#module_tree').tree({
        data: data,
        formatter: function (node) {
          return node.name;
        },
        loadFilter: myLoadFilter,
        onBeforeExpand: function (node) {
          return loadSubNode(node);
        }
      });
      ajaxLoadEnd();
    },
    function (err) {
      ajaxLoadEnd();
      msgAlert(err);
    }
  )
}

function loadSubNode(node) {
  if (node.type == 'folder') {
    return loadSubFolder(node);
  }
}

function loadSubFolder(node) {
  oauth2.getWithAuth("http://localhost/api/admin/folders/" + node.id + "/sub_folder/", function (data) {
    $('#module_tree').tree('append', {
      parent: node.target,
      data: data
    });
  })
}


//
function myLoadFilter(data, parent) {
  if (data.type) {
    if (data.type == "module") {
      var children = [];
      if (data.entities) {
        var entities = {name: "entities", children: data.entities, iconCls: "icon-man"};
        children.push(entities);
      }
      if (data.folders) {
        var folders = {name: "folders", children: data.folders};
        data.folders.forEach(function (f) {
          f.state = "closed"
        });
        children.push(folders);
      }
      return children;
    }
  }else{
    return data;
  }

}

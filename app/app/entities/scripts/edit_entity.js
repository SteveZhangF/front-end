
var entityD;
function getEntityDetail(){
  console.log(window.location.href)
  var entity = QueryStringToJSON(window.location);

  oauth2.getWithAuth("http://localhost:8080/admin/entities/"+entity.id, function (data) {
      entityD = data;
      $('#edit_entity_form').form('load',{
        name: entityD.name,
        description:entityD.description,
        updateTime: dateFormatter(entityD.updateTime),
        createTime:dateFormatter(entityD.createTime)
      });
      $('#fields_grid').datagrid({loadFilter: pagerFilter}).datagrid('loadData', entityD.fields);

      ajaxLoadEnd();
    },
    function (err) {
      console.log(err);
      ajaxLoadEnd();
      msgAlert(err);
    }
  )
}

var fieldsToolBar = [{
  text: 'refresh',
  iconCls: 'icon-reload',
  handler: function () {
    getEntityDetail();
  }
},
  {
    text: 'add',
    iconCls: 'icon-add',
    handler: function () {
      showCreateField();
    }
  },
  {
    text:'edit',
    iconCls: 'icon-edit',
    handler: function () {
      editField();
    }
  }
];

function saveEntity(){

}

function showCreateField(){
  $('#edit_field_form').form('clear');
  $('#create_field_win').window('open');
}

function editField(){

  console.log('editing field of ' + entityD.id);
  var field = getSelectedRow($('#fields_grid'));
  console.log(field);
  $('#edit_field_form').form('load',{
    name: field.name,
    description:field.description,
    ifNull:field.ifNull,
    length:field.length,
    fieldType:field.fieldType,
    id:field.id,
    updateTime: (field.updateTime),
    createTime:(field.createTime),
    deleted:field.deleted
  });
  $('#create_field_win').window('open');
}

function saveOrUpdateField(){
  var field =  $('#edit_field_form').serializeObject();
  console.log(field);




}



//// url to json
//function QueryStringToJSON(location) {
//  var pairs = location.search.slice(1).split('&');
//  var result = {};
//  pairs.forEach(function(pair) {
//    pair = pair.split('=');
//    result[pair[0]] = decodeURIComponent(pair[1] || '');
//  });
//  return JSON.parse(JSON.stringify(result));
//}

//
//function myLoadFilter(data, parent){
//  var state = $.data(this, 'tree');
//
//  function setData(){
//    var serno = 1;
//    var todo = [];
//    for(var i=0; i<data.length; i++){
//      todo.push(data[i]);
//    }
//    while(todo.length){
//      var node = todo.shift();
//      if (node.id == undefined){
//        node.id = '_node_' + (serno++);
//      }
//      if (node.children){
//        node.state = 'closed';
//        node.children1 = node.children;
//        node.children = undefined;
//        todo = todo.concat(node.children1);
//      }
//    }
//    state.tdata = data;
//  }
//  function find(id){
//    var data = state.tdata;
//    var cc = [data];
//    while(cc.length){
//      var c = cc.shift();
//      for(var i=0; i<c.length; i++){
//        var node = c[i];
//        if (node.id == id){
//          return node;
//        } else if (node.children1){
//          cc.push(node.children1);
//        }
//      }
//    }
//    return null;
//  }
//
//  setData();
//
//  var t = $(this);
//  var opts = t.tree('options');
//  opts.onBeforeExpand = function(node){
//    var n = find(node.id);
//    if (n.children && n.children.length){return}
//    if (n.children1){
//      var filter = opts.loadFilter;
//      opts.loadFilter = function(data){return data;};
//      t.tree('append',{
//        parent:node.target,
//        data:n.children1
//      });
//      opts.loadFilter = filter;
//      n.children = n.children1;
//    }
//  };
//  return data;
//}

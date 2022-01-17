$(function () {
  //获取文章分类列表
  var layer = layui.layer
  var form = layui.form
  initArtCateList()
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res);
        var htmlStr = template('tpl-table', res)
        // console.log(htmlStr);

        $('tbody').html(htmlStr)
      }
    })
  }
  // 添加类别事件
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    layer.open({
      type: 1,
      title: '添加文章分类',
      area: ['400px', '250px'],
      content: $('#dialog-add').html()
    });
  })
  //通过代理形式，为form-add表单添加submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    // console.log('a');
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增失败')
        }
        initArtCateList()
        layer.msg('新增成功')
        // 根据索引关闭层
        layer.close(indexAdd)
      }
    })
  })
  var indexEdit = null
  $('tbody').on('click', '#btn-edit', function () {
    // console.log('a');
    //弹出修改文章文类层
    indexEdit = layer.open({
      type: 1,
      title: '修改文章分类',
      area: ['400px', '250px'],
      content: $('#dialog-edit').html()
    });
    var id = $(this).attr('data-id')
    // console.log(id);
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        console.log(res);
        form.val('form-edit', res.data)
      }
    })
  })
  //绑定submit事件通过代理
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    // console.log('a');
    $.ajax({
      method: 'POST',
      utl: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新失败')
        }
        layer.msg('更新成功')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })
  // 添加删除按钮点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // console.log('a');
    var id = $(this).attr('data-id')
    // 询问框提示是否删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.msg('删除成功')
          layer.close(index)
          initArtCateList()

        }
      })

      layer.close(index);
    });
  })
})
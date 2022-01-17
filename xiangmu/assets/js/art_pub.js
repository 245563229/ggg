$(function () {
  var layer = layui.layer
  var form = layui.form
  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('初始失败')
        }
        layer.msg('初始成功')
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }
  var $image = $('#image')
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  //初始化裁剪区
  $image.cropper(options)
  //为封面选择按钮绑定点击事件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })
  // 监听coverFile的change事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据文件创建对应的url地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区重新设置图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域

  })
  // 定义文章发布状态
  var art_state = '已发布'

  //为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })
  $('#btnSave1').on('click', function () {
    art_state = '已发布'
  })

  // 为表单绑定submit提交事件、
  $('#form-pub').on('submit', function (e) {
    // 组织默认的提交行为
    e.preventDefault()
    // 基于form表单。快速创建一个FormData对象
    var fd = new FormData($(this)[0])
    // 将文章的发布状态，存到fd中
    fd.append('state', art_state)
    // fd.forEach(function (v, k) {
    //   console.log(k, v);
    // })

    // 将封面裁剪过后的图片输出位文件对象
    //将文件对象存储到fd中
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        fd.append('cover_img', blob)
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 发起ajax数据请求，
        publishArticle(fd)
      })
  })
  // 定义发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 如果向服务器提交的是FormData属性，必须添加一下两个配置
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('上传失败')
        }
        layer.msg('上传成功')
        // 发表文章成功后跳转到文章列表页面
        location.href = '/xiangmu/article/art_list.html'
      }
    })
  }
})
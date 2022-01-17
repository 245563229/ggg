$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;
  // console.log('a');
  // 定义美化事件过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
  }
  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  // console.log('a');

  // 定义查询参数对象，将来请求数据时，将请求参数对象提到服务器
  var q = {
    pagenum: 1,//页码，默认请求第一页的数据
    pagesize: 2,//每页显示几条数据，默认每页2条
    cate_id: '',//文章分类的ID
    state: '',//文章发布的状态
  }
  initTable()
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章失败')
        }
        console.log(res);
        // 使用模版引擎渲染也变
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
    // console.log('a');

  }
  initCate()
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败')
        }
        // res.data = [
        //   { id: 1, title: 'title', cate_name: '美食', state: '草稿' },
        //   { id: 1, title: 'title', cate_name: '美食', state: '草稿' },
        //   { id: 1, title: 'title', cate_name: '美食', state: '草稿' },
        //   { id: 1, title: 'title', cate_name: '美食', state: '草稿' }
        // ]
        //调用模版引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        console.log(htmlStr);
        $('[name=cate_id]').html(htmlStr)
        //通过layui重新渲染表单区域的ui结构
        form.render()
      }
    })
  }
  //筛选表单绑定submit事件
  $('#form_search').on('submit', function (e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    //为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    initTable()
  })
  //定义渲染分页的方法
  function renderPage(total) {
    //调用方法，渲染分页的结构
    laypage.render({
      elem: 'pageBox',//分页容器的id
      count: total,//总数据条数
      limit: q.pagesize,//每页显示的条数
      curr: q.pagenum,//默认选中哪页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 4, 5],

      //分页发生切换时出发jump
      jump: function (obj, first) {
        console.log(obj.curr);
        //把最新的页码值，赋值到q这个查询参数对象中
        q.pagenum = obj.curr
        //把最新的条目数赋值到q这个查询参数对象的pagesize属性中
        q.pagesize = obj.limit
        console.log(first);
        console.log(obj.curr);
        //1.点击页码时，触发jump
        //2.调用了laypage.render()，也会出发jump
        // 此处出发死循环
        // initTable()
        if (!first) {
          initTable()//判断是否为点击页码导致的，如果为laypage.render触发的，则不再第调用该方法
        }
        // 根据最新的q获取对应的数据列表，并渲染表格
      }
    })
    // console.log(total);
  }
  // console.log('a');

  $('tbody').on('click', '.btn-delete', function () {
    //获取文章的id
    var id = $(this).attr('data-id')
    //询问用户是否删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.msg('删除成功')
          initTable()
        }
      })
      layer.close(index);
    });
  })
  // 为删除按钮绑定代理事件
  $('tbody').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length
    // 获取到文章id
    var id = $(this).attr('data-id')
    //询问是否删除
    layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          // console.log('a');

          layer.msg('删除成功')
          //问题。当前页删除干净后又拿了本页的数据，但是页码器已经判断页码数-1了。导致不符,所以应该先-1页码，再拿数据
          if (len === 1) {
            // 如果len=1 则删除完毕后页面上就没有数据了
            //页码值不能小于1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      // console.log('a');

      layer.close(index);
    });
  })
})
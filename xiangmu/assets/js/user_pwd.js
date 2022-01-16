$(function () {
  var form = layui.form
  var layer = layui.layer
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    samePwd: function (value) {
      if (value === $('[name=oldPwd').val()) {
        return '新旧密码不能相同'
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd').val()) {
        return '两次密码不一致'
      }
    }
  })
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('更新密码失败')

        }
        layui.layer.msg('更新密码成功')
        //重置表单
        $('.layui-form')[0].reset()
      }
    })
  })
  // initUserInfo()
  // // 初始化用户基本信息
  // function initUserInfo() {
  //   $.ajax({
  //     method: 'GET',
  //     url: '/my/userinfo',
  //     success: function (res) {
  //       if (res.status !== 0) {
  //         return layer.msg('获取用户信息失败!')
  //       }
  //       console.log(res);
  //       //调用form.val（）为表单赋值
  //       form.val('formUserInfo', res.data)
  //     }
  //   })
  // }
  // //重置表单
  // $('#btnReset').on('click', function (e) {
  //   // e.preventDefault()
  //   // initUserInfo()
  // })
  // //监听表单提交事件
  // $('.layui-form').on('submit', function (e) {
  //   e.preventDefault()
  //   $.ajax({
  //     method: 'POST',
  //     url: '/my/userinfo',
  //     data: $(this).serialize(),
  //     success: function (res) {
  //       if (res.status !== 0) {
  //         return layer.msg('更新信息失败')
  //       }
  //       layer.msg('更新用户信息成功!')
  //       //调用父页面的方法，重新渲染用户头像和基本信息
  //       window.parent.getUserInfo()
  //     }
  //   })
  // })
})
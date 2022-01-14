$(function () {
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })
  var form = layui.form
  var layer = layui.layer
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  //监听注册表单提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.post('http://www.liulongbin.top:3007/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function (res) {
      // console.log($('#form_reg [name=password]').val());
      // console.log(res);
      if (res.status != 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功');
      $('#link_login').click()
    })
  })
  $('#form_login').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      url: 'http://www.liulongbin.top:3007/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登陆失败!')
        }
        layer.msg('登录成功!')
        localStorage.setItem('token', res.token)
        location.href = '/xiangmu/index.html'
      }
    })
  })
})
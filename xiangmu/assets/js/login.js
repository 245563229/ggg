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
  var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
  //监听注册表单提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.post('http://www.liulongbin.top:3007/api/reguser', data, function (res) {
      console.log(data);
      console.log(res);
      if (res.status != 0) {
        return console.log(res.message);
      }
      console.log('注册成功');
      // $('#link_login').click()
    })
  })

})
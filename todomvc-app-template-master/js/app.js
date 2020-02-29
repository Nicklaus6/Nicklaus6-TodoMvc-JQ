// 功能：

//(function (window) {

$(function () {
  'use strict';
  $()
  //1.页面初始化
  //当没有todos时 隐藏.main和.footer部分
  //想复杂了 一上来用JQ的hide..测试的时候出现了刷新闪现的问题 然后想到了直接改CSS的display:none 但还在JQ这里改 然后想到了是加载顺序的问题 然后想到了，直接在head的样式表里写不就好了。。
  //当.todo-list没有子元素时，隐藏.footer  供删除和清除已完成时没有todo了调用
  function clean () {
    if ($('.todo-list li').length <= 0) {
      $('.footer').hide();
    }
  }

  //2.添加todo
  //在.new-todo中输入内容后 回车 创建一行新的todo

  //绑定键盘事件 方法1
  // $('header input').keydown(function (event) {
  //   var e = event || window.e;
  //   var keyCode = e.keyCode || e.which;//使用 which 或 keyCode, 这样可支持不同浏览器
  //   //如果在.new-todo中按下回车 且表单内容不为空
  //   if (keyCode === 13 && this.value!== '') {
  //     alert(1);
  //   }
  // })
  //绑定键盘事件 方法2
  $('.new-todo').bind('keydown', function () {
    //将输入的内容trim后保存到content变量中
    var content = $.trim(this.value);
    //当在.new-todo中按下回车 而且.new-todo中内容不为空
    if (event.keyCode === 13 && content != '') {
      //显示.main和.footer
      $('.main,.footer').show();
      //ES6模板字符串 `字符串` 反引号``包裹字符串 变量写在${}中
      var todoElement = `<li>
                            <div class="view">
                              <input class="toggle" type="checkbox">
                              <label>${content}</label>
                              <button class="destroy"></button>
                            </div>
                            <input class="edit" value=''>
                          </li>`
      //在.todo-list中追加todoElement保存的html
      $('.main .todo-list').append(todoElement);
      //这里遇到的问题： 为什么class样式不起作用？
      //问题在于 写成了$('.main').append(todoElement); 
      //li应该加到.main的ul中 而不是直接加入.main中

      //添加新的todo后 .new-todo恢复初始状态 并失去焦点
      $(this).val(this.defaultValue).blur();


      //3.删除todo
      //点击.destroy按钮 删掉按钮的所在的整个li元素
      $('.destroy').click(function () {
        //选出当前对象的所有祖先中的li元素，remove()删除li元素和它的子元素，empty()只删除子元素。
        $(this).parents('li').remove();
        //删除最后一个todo后出现.footer还在的问题
        //应该在删除时判断 放在外面判断的话会在还没点的时候就执行
        //当.todo-list没有子元素时，隐藏.footer
        // if ($('.todo-list li').length <= 0) {
        //   $('.footer').hide();
        // }
        clean();
      })

      //4.打勾按钮
      //点击选框 
      $('.toggle').click(function () {

        //一开始的思路是根据判断是否有class来做 看了很久不知道问题出在哪里 控制台的东西也很乱 会打印好几次 没弄懂为什么 所以换个思路
        //判断选框状态是否checked  选中就addClass  没选中就removeClass
        if ($(this).prop('checked')) { $(this).parents('li').addClass('completed') }
        else { $(this).parents('li').removeClass('completed') };
        //判断所在的li有没有class'completed' 有就删除没有就添加
        // if ($(this).parents('li').hasClass('completed')) {
        //   $(this).parents('li').removeClass('completed');
        //   console.log($(this).parents('li') + 'remove');
        // } else {
        //   $(this).parents('li').addClass('completed');
        //   console.log($(this).parents('li') + 'add')
        // }
        //试了改了好几次总不行 重新写个吧
        //console.log($(this).prop('checked'))

        //当至少有一个todo .toggle时才显示
        if ($('.toggle:checkbox:checked').length > 0) { $('.clear-completed').show(); }
        else { $('.clear-completed').hide() };

        //点击 .toggle-all 
      })


      //5.清除已完成
      //删除所有打勾状态的todo元素
      $('.clear-completed').click(function () {
        //判断状态
        //选出属性为checked的.toggle 的父元素中的li 删除
        $('.toggle:checked').parents('li').remove();
        //console.log($('.toggle:checked')); //注意属性选择器的写法 $('.toggle[checked]')的写法错误！
        //当.todo-list没有子元素时，隐藏.footer
        // if ($('.todo-list li').length <= 0) {
        //   $('.footer').hide();
        // }
        clean();
      })


      //6.编辑
      //双击label标签 
      $('.todo-list label').dblclick(function () {
        //给当前对象的父元素的li 添加class 'editing' ，
        $(this).parents('li').addClass('editing');

        //找到编辑状态新增input
        //console.log($('.todo-list input')) // input .edit

        //将当前点击的label保存到变量labelClick 方便使用
        //var labelClick = $(this);


        //input .edit 获得焦点，value值为原来的内容，失去焦点保存内容，绑定键盘事件
        $('input.edit').focus().val($(this).siblings('.view').children('label').text()).bind('keydown', function (event) {
          //enter   输入内容不为空 就将点击的label标签中的内容替换为当前对象的value  为空就删除这个todo
          if (event.keyCode === 13) {
            if (this.value !== '') {
              ///输入内容不为空 就将点击的label标签中的内容替换为当前对象的value
              console.log(content);
              //将点击的label标签中的内容替换为当前对象的value
              $(this).siblings('.view').children('label').text($(this).val());

              //问题1：labelClick的value确实修改了 退出编辑状态后 文本框的内容怎么没有替换？？
              //目标：将点击的label标签中的text值替换成当前对象的value值
              //我的代码是 将点击的label标签的value值替换成当前对象的value值
              //$(labelClick).val($(this).val());
              //解决的方法: 重新看了以下html结构 <label>${content}</label> 意识到 修改的应该是labe的文本内容
              //问题2：//为什么修改过一次后 在第二行修改的 回车后 保存到第一次修改的去了???
              //思路和解决方法：
              //console.log(labelClick)// 发现输出的每次当前点击的label都是同一个
              //希望每次labelClick都是只有当前点击的那个对象
              //经过反复的read和调试 发现问题出在变量labelclick上 labelclic始终保存了第一次点的label所以修改的都是第一个
              //其实将对象保存到变量中也没有方便很多 而且容易混淆 试了很久还是不行 而用this不容易错 而且一次成功了
              //这个是目前为止卡了最久的问题

              // console.log(this.value == $(this).val()); 要注意JS写法和JQ写法

              //清空保存在input .edit中的值 即恢复它的原始状态
              $(this).val(this.defaultValue);

              //退出编辑状态 清除class 'editing'
              $(this).parents('li').removeClass('editing');
            } else {
              //内容为空 就删除这个todo
              $(this).parents('li').remove();
              clean();
              console.log(this.value = "")
            }
          };
          //第一次修改的时候正常 第二次修改的时候把if和else里的都执行了一遍


          //esc 则退出编辑状态 清除class'editing'
          if (event.keyCode === 27) {
            $(this).parents('li').removeClass('editing');
          };
        }

          //把Blur先删了


        )

      })

    }


    //7.



  })


})









//})(window);

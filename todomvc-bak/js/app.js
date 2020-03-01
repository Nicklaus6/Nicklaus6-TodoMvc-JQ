$(function() {
  const ENTER = 13
  const ESC = 27

  let $todoList = $('.todo-list')
  let $input = $('.new-todo')
  let $main = $('.main')
  let $footer = $('.footer')
  let $count = $('.todo-count strong')

  // 1. enter 保存数据
  $input.on('keydown', function(e) {
    const { keyCode, target } = e
    if (keyCode === ENTER && target.value !== '') {
      addTodoItem(target.value)
    }
  })

  // 2. 删除`item`
  $todoList.on('click', '.destroy', function removeItem() {
    $(this).parent().parent().remove()
    computedCount()
  })

  /**
   * @function 添加一个todo-item
   * @param {String} value 需要添加的值
   * @description
   *  1. main 和 footer展示
   *  2. 添加内容到列表顶部
   *  3. 刷新底部数据
   *  4. 清空 input 中的 value
   */
  function addTodoItem (value) {
    // TODO: 这些以后都可以初始化操作点，先这样
    $main.css('display', "block")
    $footer.css('display', "block")

    $todoList.prepend(`
      <li class="">
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>${value}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="${value}">
      </li>
    `)

    computedCount()

    $input.val('')

  }

  /**
   * @function 计算`items`数目
   */
  function computedCount() {
    $count.text($todoList.children().length)
  }
})
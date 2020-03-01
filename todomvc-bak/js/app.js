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

  // 2. 删除
  $todoList.on('click', '.destroy', function(e) {
    e.stopPropagation()
    e.preventDefault()
    console.log(e)
    return false
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

    $count.text($todoList.children().length)

    $input.val('')

  }
})
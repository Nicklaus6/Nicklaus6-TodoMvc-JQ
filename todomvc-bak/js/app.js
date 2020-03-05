$(function() {
  const ENTER = 13
  const ESC = 27

  let $todoList = $('.todo-list')
  let $input = $('.new-todo')
  let $main = $('.main')
  let $footer = $('.footer')
  let $count = $('.todo-count strong')

  // 状态标识位
  let isUpdate = false 

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

  // 3. edit item
  $todoList.on('dblclick', '.view', function editItem() {
    $(this).parent().addClass('editing')

    const $edit = $(this).siblings('.edit')
    $edit.focus()

    // 这里之所以不用 on绑定，是想覆盖事件，减少内存占用以及处理bug，用on会多次调用产生bug
    // 如果想用 on 事件的话，建议先 off 请求原来的事件再重新绑定

    // 不管是 ESC 还是 ENTER，目的都是失焦，仅仅就是看是否需要更新数据罢了
    $edit.keydown(function(e) {
      const { keyCode } = e
      if (keyCode === ESC || keyCode === ENTER) {
        isUpdate = keyCode === ENTER
        $(this).blur()
      }
    })
  })

  // 4. 失焦
  $todoList.on('blur', '.edit', function blurInput() {
    updateItem($(this).parent())
    $(this).parent().removeClass('editing')
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
   * @function 计算`items`数目,清除头部，底部状态。
   */
  function computedCount() {
    const len = $todoList.children().length
    const display = len > 0 ? 'block' : 'none'

    $main.css('display', display)
    $footer.css('display', display)

    $count.text($todoList.children().length)
    return len
  }

  /**
   * @function 是否更新数据
   * @param { Jquery } @li 当前修改列表item的JQ对象
   */
  function updateItem ($li) {
    let oldVal = $li.children('.view').children('label').text()
    let newVal = $li.children('.edit').val()

    isUpdate
      ? $li.children('.view').children('label').text(newVal)
      : $li.children('.edit').val(oldVal)

    // 复位
    isUpdate = false
  }
})
class GameLog {
    constructor() {
        this.$el = document.getElementById('log')
    }

    /*
      Добавить информацию о ходе в лог
      @color - цвет игрока
      @move - объект хода
    */
    addMoveInfo(color, move) {
        const positionInfo = move.getInfo()

        this.$el.value += `Move ${color} ${move.figure.name}: ${positionInfo.startX}${positionInfo.startY} -> ${positionInfo.endX}${positionInfo.endY} \n\r`
        this.$el.scrollTop = this.$el.scrollHeight
    }

    /*
      Добавить кастомную информацию в лог
      @text - текст
    */
    addCustomInfo(text) {
        this.$el.value += `${text} \n\r`
        this.$el.scrollTop = this.$el.scrollHeight
    }

    /*
       Очистить лог
    */
    clear() {
        this.$el.value = ''
    }
}


export default GameLog
class GameLog {
    constructor() {
        this.$el = document.getElementById('log')
    }

    addMoveInfo(color, move) {
        this.$el.value += `Ход ${color}: с ${move.startX}:${move.startY} на ${move.endX}:${move.endY} \n\r`
        this.$el.scrollTop = this.$el.scrollHeight
    }

    addCustomInfo(text) {
        this.$el.value += `${text} \n\r`
        this.$el.scrollTop = this.$el.scrollHeight
    }

    clear() {
        this.$el.value = ''
    }
}


export default GameLog
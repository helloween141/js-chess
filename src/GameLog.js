class GameLog {
    constructor() {
        this.$el = document.getElementById('log')
    }

    addMoveInfo(color, move) {
        const positionInfo = move.getInfo()

        this.$el.value += `Ход ${color} ${move.figure.name}: ${positionInfo.startX}${positionInfo.startY} - ${positionInfo.endX}${positionInfo.endY} \n\r`
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
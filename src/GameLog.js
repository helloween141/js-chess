class GameLog {
    constructor() {
        this.$el = document.getElementById('log')
    }

    addMoveInfo(color, moveFrom, moveTo) {
        const name = color === 'white' ? 'белых' : 'черных'

        this.$el.value += `Ход ${name}: с ${moveFrom} на ${moveTo} \n\r`
    }

    addCustomInfo(text) {
        this.$el.value += `${text} \n\r`
    }

    clear() {
        this.$el.value = ''
    }
}


export default GameLog
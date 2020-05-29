import Human from './Human'
import { START_FIGURES_COLOR } from '../global'

class Player {
  constructor(Type = Human, name, color) {
    this.type = new Type(name, color)
    this.color = color
    this.name = name
    this.isCurrent = (color === START_FIGURES_COLOR ? true : false)
  }

  // Получить информацию по текущему ходу игрока (posFrom, posTo)
  getMove(cells) {
    return this.type.getMove(cells)
  }
}

export default Player

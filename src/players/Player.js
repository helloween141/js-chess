import Human from './Human'
import { START_FIGURES_COLOR } from '../global'

class Player {
  constructor(Type, name, color, figures) {
    this.type = new Type(name, color, figures)
    this.color = color
    this.name = name
    this.figures = figures
    this.isCurrent = (color === START_FIGURES_COLOR ? true : false)
  }

  // Получить информацию по текущему ходу игрока (posFrom, posTo)
  getMove(cells) {
    return this.type.getMove(cells)
  }

  
}

export default Player

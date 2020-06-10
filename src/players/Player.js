import { START_FIGURES_COLOR } from '../global'

class Player {
  constructor(name, color, figures, isHuman) {
    this.isHuman = isHuman
    this.color = color
    this.name = name
    this.figures = figures
    
    this.isCurrent = (color === START_FIGURES_COLOR ? true : false)
  }

  /*
    Возвращает все возможные ходы игрока, по которым он может атаковать
  */
  getAttackMoves(cells) {
    let result = []
    this.figures.forEach(figure => {
      const moves = (figure.name === 'P') ? figure.getMoves(cells, [], true) : figure.getMoves(cells)

      if (moves.length > 0) {
        result = [...result, ...moves]
      }
    })
    return result
  }

}

export default Player

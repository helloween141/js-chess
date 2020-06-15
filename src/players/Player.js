import { START_FIGURES_COLOR } from '../global'

class Player {
  constructor(name, color, figures, isHuman) {
    this.isHuman = isHuman
    this.color = color
    this.name = name
    this.figures = figures
    
    this.isCurrent = (color === START_FIGURES_COLOR ? true : false)
    this.isShach = false
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

  getKingFigure() {
    return this.figures.find(figure => figure.name === 'K' || figure.name === '_K')
  }

  checkShach(opponentMoves) {
    const kingFigure = this.getKingFigure()
    console.log('Opponent Moves for snapshot')
    console.log(opponentMoves)
    console.log(`King pos: ${kingFigure.getPositionPoint().x}, ${kingFigure.getPositionPoint().y}`)
    // Но если есть возможность срубить фигуру, то пропускаем 
    opponentMoves.find(move => kingFigure.getPositionPoint().y === move[0] && kingFigure.getPositionPoint().x === move[1]) 
    ? this.isShach = true  
    : this.isShach = false

    return this.isShach
  }

}

export default Player

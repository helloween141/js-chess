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
      let figureName = (figure.color === 'black') ? '_' + figure.name : figure.name

      if (cells[figure.getPositionPoint().y][figure.getPositionPoint().x] === figureName) {
        const moves = (figure.name === 'P') ? figure.getMoves(cells, [], true) : figure.getMoves(cells)

        if (moves.length > 0) {
          result = [...result, ...moves]
        }
      }

    })
    return result
  }

  getKingPosition() {
    return this.figures.find(figure => figure.name === 'K').getPositionPoint()
  }

  checkShach(opponentMoves, potentialKingPosition = null) {
    const kingPosition = potentialKingPosition ? potentialKingPosition : this.getKingPosition()

    console.log('Opponent Moves for snapshot')
    console.log(opponentMoves)
    console.log(kingPosition)
    // Но если есть возможность срубить фигуру, то пропускаем 
    console.log(opponentMoves.find(move => kingPosition.y === move[0] && kingPosition.x === move[1]) )
    opponentMoves.find(move => kingPosition.x === move[0] && kingPosition.y === move[1]) 
    ? this.isShach = true  
    : this.isShach = false
    console.log(this.isShach)
    return this.isShach
  }

}

export default Player

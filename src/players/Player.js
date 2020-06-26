import { START_FIGURES_COLOR } from '../global'

class Player {
  constructor(name, color, figures, isHuman) {
    this.isHuman = isHuman
    this.color = color
    this.name = name
    this.figures = figures

    this.isCurrent = (color === START_FIGURES_COLOR ? true : false)
    this.selectedFigure = null
  }

  /*
    Получить все возможные ходы игрока для выбранной фигуры
    @opponentPlayer - вражеский игрок
    @cellsSnapshot - слепок игрового поля
  */
  getAllPossibleMoves(selectedFigure, opponentPlayer, cellsSnapshot) {
    if (selectedFigure) {
      const possibleMoves = []
      const playerMoves = selectedFigure.getMoves(cellsSnapshot)   
  
      playerMoves.forEach(move => {
        let tmpSnapshot = JSON.parse(JSON.stringify(cellsSnapshot))

        let potentialKingPosition = null
        if (selectedFigure.name === 'K') {

          // Проверка возможности рокировки справа
          if (move[0] === (selectedFigure.getPositionPoint().x + 2)) {
            const rCastlingRook = this.figures.find(figure => figure.name === 'R' && figure.canCastling && figure.getPositionPoint().x > move[0])
            if (!rCastlingRook) {
              return
            }
          }
          
          // Проверка возможности рокировки слева
          if (move[0] === (selectedFigure.getPositionPoint().x - 2)) {
            const lCastlingRook = this.figures.find(figure => figure.name === 'R' && figure.canCastling && figure.getPositionPoint().x < move[0])
            if (!lCastlingRook) {
              return
            }
          }

          potentialKingPosition = {
            x: move[0],
            y: move[1]
          }
        }

        tmpSnapshot[move[1]][move[0]] = (selectedFigure.color === 'black') ? '_' + selectedFigure.name : selectedFigure.name
        tmpSnapshot[selectedFigure.getPositionPoint().y][selectedFigure.getPositionPoint().x] = ''
  
        const opponentMoves = opponentPlayer.getAttackMoves(tmpSnapshot)
  
        // Если нет шаха, то добавляем ход, как возможный
        if (!this.checkSchach(opponentMoves, potentialKingPosition)) {
          possibleMoves.push(move)  
        }

      }) 
      return possibleMoves   
    }
    return []
  }

  /*
    Получить все ходы игрока, по которым он может атаковать
  */
  getAttackMoves(cells) {
    let result = []
    this.figures.forEach(figure => {  
      const figureName = (figure.color === 'black') ? '_' + figure.name : figure.name

      if (cells[figure.getPositionPoint().y][figure.getPositionPoint().x] === figureName) {
        const moves = (figure.name === 'P') ? figure.getMoves(cells, true) : figure.getMoves(cells)

        if (moves.length > 0) {
          result = [...result, ...moves]
        }
      }
    })

    return result
  }

  /*
    Получить позицию короля
  */
  getKingPosition() {
    return this.figures.find(figure => figure.name === 'K').getPositionPoint()
  }

  /*
    Проверить на шах
    @opponentMoves - все ходы оппонента
    @customKingPosition - потенциальная позиция короля
  */
  checkSchach(opponentMoves, potentialKingPosition = null) {
    const kingPosition = potentialKingPosition ? potentialKingPosition : this.getKingPosition()
    return opponentMoves.find(move => kingPosition.x === move[0] && kingPosition.y === move[1]) ? true : false
  }

}

export default Player

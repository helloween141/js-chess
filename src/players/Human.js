import Player from "./Player"

class Human extends Player {
  constructor(name, color, figures) {
    super(name, color, figures, true)

    this.name = name
    this.color = color
    this.figures = figures
    this.selectedFigure = null
  }

  getMove(cells, clickX, clickY, opponentPlayer) {
    let excludedMoves = []
    if (this.selectedFigure.name === 'K') {
      excludedMoves = opponentPlayer.getAttackMoves(cells)
    }

    const canMove = (this.selectedFigure.getMoves(cells, excludedMoves)).find(move => move[0] === clickX && move[1] === clickY)
    if (canMove) {
      return {
        startPosPointer: this.selectedFigure.getPositionPoint(),
        endPosPointer: {
          x: clickX,
          y: clickY
        }
      }
    } else {
      return null
    }
  }
}

export default Human

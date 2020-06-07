import Player from "./Player"

class Human extends Player {
  constructor(name, color, figures) {
    super(name, color, figures, true)

    this.name = name
    this.color = color
    this.figures = figures
  }

  getMove(cells, figure, clickX, clickY, opponentPlayer) {
    let excludedMoves = []
    if (figure.name === 'K') {
      excludedMoves = opponentPlayer.getAttackMoves(cells)
    }

    const canMove = (figure.getMoves(cells, excludedMoves)).find(move => move[0] === clickX && move[1] === clickY)
    
    if (canMove) {
      return {
        startX: figure.getPositionPoint().x,
        startY: figure.getPositionPoint().y,
        endX: clickX,
        endY: clickY
      }
    } else {
      return null
    }
  }
}

export default Human

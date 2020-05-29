class Human {
  constructor(name, color) {
    this.selectedFigure = null
    this.name = name
    this.color = color
  }

  getMove(cells, figure, clickX, clickY) {
    const moves = figure.getMoves(cells)
    
    const canMove = moves.find((move) => move[0] == clickX && move[1] == clickY)
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

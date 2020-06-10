import Player from "./Player"

class Human extends Player {
  constructor(name, color, figures) {
    super(name, color, figures, true)

    this.name = name
    this.color = color
    this.figures = figures
    this.selectedFigure = null
  }

  _getActions(cells) {
    const selectedCell = this.board.selectCell(cellX, cellY)

    // Ход
    if (humanMoves.length > 0) {
      const movePos = this.currentPlayer.getMove(humanMoves, cellX, cellY)
      this.gameLoop(new Move(this.currentPlayer.selectedFigure, movePos.startPosPointer, movePos.endPosPointer))
      humanMoves = []
    }
    // Подсветка возможных ходов
    else if (selectedCell.getFigure() && selectedCell.getFigure().color === this.currentPlayer.color) {
      selectedCell.setSelect()    
      this.currentPlayer.selectedFigure = selectedCell.getFigure()    

      humanMoves = (selectedCell.getFigure().name === 'K')
                 ? selectedCell.getFigure().getMoves(this.board.cells, this._getOpponent().getAttackMoves(this.board.cells))
                 : selectedCell.getFigure().getMoves(this.board.cells)
                 
      humanMoves.forEach(move => this.board.cells[move[1]][move[0]].setHighlight())  
    }
  }
  
  getMove(moves, clickX, clickY) {
    const canMove = moves.find(move => move[0] === clickX && move[1] === clickY)
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

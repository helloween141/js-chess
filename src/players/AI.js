import { BOARD_CELLS_COUNT } from '../global'

class AI {
  constructor(color) {
    this.color = color
    this.selectedFigure = null
  }

  _getPossibleSteps(cells) {
    let result = []
    for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
      for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
        const figure = cells[j][i].figure
        if (figure && figure.color === this.color) {
          /*
                Всякие разные проверки (шах, возможность срубить и так далее)
          */
          const moves = figure.getMoves(cells)
          if (moves.length > 0) {
            result.push({
              figure,
              moves,
            })
          }
        }
      }
    }
    return result
  }

  getMove(cells) {
    const possibleSteps = this._getPossibleSteps(cells)
    if (possibleSteps.length > 0) {
      const figureId = Math.floor(possibleSteps.length * Math.random())
      const figureMoves = possibleSteps[figureId].moves
      this.selectedFigure = possibleSteps[figureId].figure

      return figureMoves[Math.floor(figureMoves.length * Math.random())]
    } else {
      return []
    }
  }
}

export default AI

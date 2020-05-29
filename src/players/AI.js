import { BOARD_CELLS_COUNT } from '../global'

class AI {
  constructor(name, color) {
    this.selectedFigure = null
    this.name = name
    this.color = color
  }

  _getActions(cells) {
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
    const possibleActions = this._getActions(cells)

    if (possibleActions.length > 0) {
      const actionId = Math.floor(possibleActions.length * Math.random())

      const figure = possibleActions[actionId].figure
      const moveTo = possibleActions[actionId].moves[Math.floor(possibleActions[actionId].moves.length * Math.random())] 

      return {
        startX: figure.getPositionPoint().x,
        startY: figure.getPositionPoint().y,
        endX: moveTo[0],
        endY: moveTo[1]
      }

    } else {
      return null
    }
  }
}

export default AI

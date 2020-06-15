import Player from './Player'

class AI extends Player {
  constructor(name, color, figures) {
    super(name, color, figures, false)
    
    this.name = name
    this.color = color
    this.figures = figures
    this.selectedFigure = null
  }

  _getActions(cells) {
    const result = []
    const figures = this.figures

    if (this.checkShach()) {
      figures = this.getKingFigure()
    }

    this.figures.forEach(figure => {
      const moves = figure.getMoves(cells)
      if (moves.length > 0) {
        result.push({
          figure,
          moves,
        })
      }
    })
    return result
  }

  getMove(cells) {
    const possibleActions = this._getActions(cells)

    if (possibleActions.length > 0) {
      const actionId = Math.floor(possibleActions.length * Math.random())

      const figure = possibleActions[actionId].figure
      const moveTo = possibleActions[actionId].moves[Math.floor(possibleActions[actionId].moves.length * Math.random())] 
      
      this.selectedFigure = figure

      return {
        startPosPointer: {
          x: figure.getPositionPoint().x,
          y: figure.getPositionPoint().y
        },
        endPosPointer: {
          x: moveTo[0],
          y: moveTo[1]
        }
      }
    } else {
      return null
    }
  }
}

export default AI

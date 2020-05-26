import { BOARD_CELLS_COUNT } from '../global'

class Human {
  constructor() {
    this.selectedFigure = null
  }

  selectSpot(cells, clickX, clickY) {
    if (clickX >= 0 && clickX < BOARD_CELLS_COUNT && clickY >= 0 && clickY < BOARD_CELLS_COUNT) {
      for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
        for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
          cells[i][j].isSelected = false
        }
      }

      const selectedSpot = cells[clickY][clickX]
      let moves = []

      // Если фигура была уже выбрана, либо есть возможность срубить
      if (this.selectedFigure && (!selectedSpot.figure || selectedSpot.figure.color !== this.color)) {
        moves = this.selectedFigure.getMoves(cells)

        return moves.find((move) => {
          if (move[0] == clickX && move[1] == clickY) {
            return move
          }
        })
      }
      // Иначе подсветка возможных ходов
      else if (selectedSpot.figure && playerColor === selectedSpot.figure.color) {
        this.selectedFigure = selectedSpot.figure
        moves = selectedSpot.figure.getMoves(cells)
        moves.forEach((move) => cells[move[1]][move[0]].highlight())
      }
    }

    return null
  }
}

export default Human

import { BOARD_CELLS_COUNT } from '../global'

class Player {
  constructor(Type, name, color) {
    this.type = new Type()
    this.color = color
    this.name = name  
  }
}

export default Player

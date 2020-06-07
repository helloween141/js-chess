import Figure from '../../Figure'

class King extends Figure {
  constructor(name, color, sprite) {
    super()
    this.name = name
    this.color = color
    this.image = this.createImage(sprite)
    this.isShah = false
    this.canCastling = true // Возможность рокировки
  }

  getMoves(cells, excluded = []) {

    const sign = this.color === 'black' ? 1 : -1
    let { x, y } = this.getPositionPoint()

    let movesList = [
      [x, y + 1 * sign],
      [x, y - 1 * sign],
      [x + 1 * sign, y],
      [x + 1 * sign, y + 1 * sign],
      [x - 1 * sign, y - 1 * sign],
      [x + 1 * sign, y - 1 * sign],
      [x - 1 * sign, y + 1 * sign],
      [x - 1 * sign, y]
    ]

    
    return movesList.filter(move => this.canMove(move[0], move[1], cells, excluded))

    // if (this.canCastling) {
    //   if (this.canMove(x - 2 * sign, y, cells, excluded)) {
    //     result.push([x - 2 * sign, y])
    //   }

    //   if (this.canMove(x + 2 * sign, y, cells, excluded)) {
    //     result.push([x + 2 * sign, y])
    //   }      
    // }   
  }

  getCropPosition() {
    return {
      x: 0,
      y: this.color === 'black' ? 0 : 64,
    }
  }
}

export default King

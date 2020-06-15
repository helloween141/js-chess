import Figure from '../../Figure'

class Knight extends Figure {
  constructor(name, color, sprite) {
    super()
    this.name = name
    this.color = color
    this.image = this.createImage(sprite)
  }

  getMoves(cells, excluded = []) {
    const sign = this.color === 'black' ? 1 : -1
    let { x, y } = this.getPositionPoint()

    let movesList = [
      [x + 1 * sign, y + 2 * sign],
      [x - 1 * sign, y + 2 * sign],
      [x + 1 * sign, y - 2 * sign],
      [x - 1 * sign, y - 2 * sign]
    ]   

    return movesList.filter(move => this.canMove(move[0], move[1], cells))
  }

  getCropPosition() {
    return {
      x: 192,
      y: this.color === 'black' ? 0 : 64,
    }
  }
}

export default Knight

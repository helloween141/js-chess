import Figure from '../../Figure'

class Queen extends Figure {
  constructor(name, color, sprite) {
    super()
    this.name = name
    this.color = color
    this.image = this.createImage(sprite)
  }

  getMoves(cells) {
    const sign = this.color === 'black' ? 1 : -1
    let { x, y } = this.getPositionPoint()
    let result = []
    let k = 1
    
    while (this.canMove(x, y + k * sign, cells)) {
      result.push([x, y + k * sign])

      if (cells[y + k * sign][x]) {
        break
      }
      k++
    }

    k = 1
    while (this.canMove(x, y - k * sign, cells)) {
      result.push([x, y - k * sign])

      if (cells[y - k * sign][x]) {
        break
      }
      k++
    }

    k = 1
    while (this.canMove(x - k * sign, y, cells)) {

      result.push([x - k * sign, y])

      if (cells[y][x - k * sign]) {
        break
      }
      k++
    }

    k = 1
    while (this.canMove(x + k * sign, y, cells)) {
      result.push([x + k * sign, y])

      if (cells[y][x + k * sign]) {
        break
      }
      k++
    }

    k = 1
    while (this.canMove(x + k * sign, y + k * sign, cells)) {
      result.push([x + k * sign, y + k * sign])

      if (cells[y + k * sign][x + k * sign]) {
        break
      }
      k++
    }

    k = 1
    while (this.canMove(x - k * sign, y + k * sign, cells)) {
      result.push([x - k * sign, y + k * sign])

      if (cells[y + k * sign][x - k * sign]) {
        break
      }
      k++
    }

    k = 1
    while (this.canMove(x - k * sign, y - k * sign, cells)) {
      result.push([x - k * sign, y - k * sign])

      if (cells[y - k * sign][x - k * sign]) {
        break
      }
      k++
    }

    k = 1
    while (this.canMove(x + k * sign, y - k * sign, cells)) {
      result.push([x + k * sign, y - k * sign])

      if (cells[y - k * sign][x + k * sign]) {
        break
      }
      k++
    }
 
    return result
  }

  getCropPosition() {
    return {
      x: 64,
      y: this.color === 'black' ? 0 : 64,
    }
  }
}

export default Queen

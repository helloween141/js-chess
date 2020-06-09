import { BOARD_CELLS_COUNT, CELL_SIZE } from './global'

class Figure {

  getPositionPoint() {
    return {
      x: this.x,
      y: this.y,
    }
  }

  setPositionPoint(x, y) {
    this.x = x
    this.y = y

    this.setPositionPixels(this.toPixels(x), this.toPixels(y))
  }

  getPositionPixels() {
    return {
      imagePosX: this.image.attrs.x,
      imagePosY: this.image.attrs.y
    }
  }

  setPositionPixels(x, y) {
    this.image.position({x, y})
  }
  
  getShape() {
    return this.image
  }

  toPixels(val) {
    return (CELL_SIZE / 2) + (val * CELL_SIZE) - 2
  }

  createImage(sprite) {
    const width = sprite.width / 6
    const height = sprite.height / 2

    const figureImg = new Konva.Image({
      width,
      height,
      image: sprite,
    })

    return figureImg.crop({
      x: this.getCropPosition().x,
      y: this.getCropPosition().y,
      width,
      height
    })
  }
 
  canMove(x, y, cells, excluded = []) {
    if (x >= 0 && x < BOARD_CELLS_COUNT && y >= 0 && y < BOARD_CELLS_COUNT) {
      if (excluded.length > 0) {
        const isProhibitedMove = excluded.find(move => move[0] === x && move[1] === y)
        if (isProhibitedMove) {
          return false
        } 
      }  
      
      if (this.name !== 'P') {
        return cells[y][x].figure && cells[y][x].figure.color === this.color ? false : true
      } else {
        return true
      }

    }
    return false
  }
}

export default Figure

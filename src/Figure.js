import { BOARD_CELLS_COUNT, ANIMATION_SPEED, CELL_SIZE } from './global'

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

    this.setImagePositionPixels(x, y)
  }

  getImagePositionPixels() {
    return {
      imagePosX: this.image.attrs.x,
      imagePosY: this.image.attrs.y
    }
  }
  
  setImagePositionPixels(x, y) {
    this.getImage().position(this.toPixels(x, y))
  }
  
  getImage() {
    return this.image
  }

  toPixels(x, y) {
    return {
      x: CELL_SIZE / 2 + x * CELL_SIZE - 2,
      y: CELL_SIZE / 2 + y * CELL_SIZE - 2,
    }
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
 
  canMove(x, y, cells) {
    if (x >= 0 && x < BOARD_CELLS_COUNT && y >= 0 && y < BOARD_CELLS_COUNT) {
      if (this.name !== 'P') {
        return cells[y][x].figure && cells[y][x].figure.color === this.color
          ? false
          : true
      } else {
        return true
      }
    }
    return false
  }
  
  updateMoveAnimation(finishAnimationCallback) {
    let { imagePosX, imagePosY } = this.getImagePositionPixels()

    // Движение по OY
    if (this.moveVector.y < 0)
      imagePosY = (imagePosY > this.endPosPixels.y) ? imagePosY - ANIMATION_SPEED : this.endPosPixels.y 
    else
      imagePosY = (imagePosY < this.endPosPixels.y) ? imagePosY + ANIMATION_SPEED : this.endPosPixels.y

    // Движение по OX
    if (this.moveVector.x < 0)
      imagePosX = (imagePosX > this.endPosPixels.x) ? imagePosX - ANIMATION_SPEED : this.endPosPixels.x
    else
      imagePosX = (imagePosX < this.endPosPixels.x) ? imagePosX + ANIMATION_SPEED : this.endPosPixels.x

    if ((imagePosX !== this.endPosPixels.x) || (imagePosY !== this.endPosPixels.y)) {
        this.image.position({
          x: imagePosX,
          y: imagePosY
        })
    } else {
      return finishAnimationCallback(this) 
    }
  }

}

export default Figure

class Move {
    constructor(figure, from, to) {
        this.figure = figure
        this.from = from
        this.to = to
    }

    updateMoveAnimation() {
        return new Promise(resolve => {
          let { imagePosX, imagePosY } = this.figure.getPositionPixels()

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
    
          if (imagePosX !== this.endPosPixels.x || imagePosY !== this.endPosPixels.y) {
            this.setPositionPixels(imagePosX, imagePosY)
          } else {
            this.setPositionPoint(this.endPosPointer.endX, this.endPosPointer.endY)
            resolve(this) 
          }
        }
    )}

}

export default Move
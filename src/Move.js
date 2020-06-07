class Move {
    constructor(figure, startPosPointer, endPosPointer) {
        this.figure = figure
        this.startPosPointer = startPosPointer
        this.endPosPointer = endPosPointer

        this.moveVector = {
            x: this.figure.getImage().attrs.x > this.endPosPixels.x ? -1 : 1,
            y: this.figure.getImage().attrs.y > this.endPosPixels.y ? -1 : 1,
        }       

        this.endPosPixels = {
            x: this.figure.toPixels(move.endX),
            y: this.figure.toPixels(move.endY),
        }       
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
            this.figure.setPositionPixels(imagePosX, imagePosY)
          } else {
            this.figure.setPositionPoint(this.endPosPointer.endX, this.endPosPointer.endY)
            resolve(this.figure) 
          }
        }
    )}

}

export default Move
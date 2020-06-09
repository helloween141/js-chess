import { ANIMATION_SPEED } from "./global"

class Move {
    constructor(figure, startPosPointer, endPosPointer) {
        this.figure = figure
        this.startPosPointer = startPosPointer
        this.endPosPointer = endPosPointer

        this.endPosPixels = {
          x: this.figure.toPixels(endPosPointer.x),
          y: this.figure.toPixels(endPosPointer.y),
        }     
        
        this.moveVector = {
          x: this.figure.getShape().attrs.x > this.endPosPixels.x ? -1 : 1,
          y: this.figure.getShape().attrs.y > this.endPosPixels.y ? -1 : 1,
        }       
    }

    getInfo() {
      return {
        startX: String.fromCharCode(97 + this.startPosPointer.x),
        startY: this.startPosPointer.y + 1,
        endX: String.fromCharCode(97 + this.endPosPointer.x),
        endY: this.endPosPointer.y + 1
      }
    }

    runAnimation() {
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
            
            this.figure.setPositionPoint(this.endPosPointer.x, this.endPosPointer.y)
            resolve(this.figure)
          }
        }
    )}

}

export default Move
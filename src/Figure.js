import { BOARD_CELLS_COUNT, CELL_SIZE } from './global'

class Figure {
  /*
    Получить позицию (вектор)
  */
  getPositionPoint() {
    return {
      x: this.x,
      y: this.y,
    }
  }

  /*
    Установить позицию (вектор)
    @x - координата X
    @y - координата Y
  */
  setPositionPoint(x, y) {
    this.x = x
    this.y = y

    this.setPositionPixels(this.toPixels(x), this.toPixels(y))
  }

  /*
    Получить позицию (пиксели)
  */
  getPositionPixels() {
    return {
      imagePosX: this.image.attrs.x,
      imagePosY: this.image.attrs.y
    }
  }

  /*
    Установить позицию (пиксели)
    @x - координата X
    @y - координата Y   
  */
  setPositionPixels(x, y) {
    this.image.position({x, y})
  }
  
  /*
    Получить форму фигуры
  */
  getShape() {
    return this.image
  }

  /*
    Перевести в пиксели
    @val - позиция ячейки (x или y)
  */
  toPixels(val) {
    return (CELL_SIZE / 2) + (val * CELL_SIZE) - 2
  }

  /*
    Получить цвет фигуры на слепке
    @figure - фигура
  */
  getFigureSnapshotColor(figure) {
    if (figure) {
      return figure[0] === '_' ? 'black' : 'white'
    } else {
      return null
    }
  }

  /*
    Создать изображение из тайлсета
    @tileset - тайлсет
  */
  createImage(tileset) {
    const width = tileset.width / 6
    const height = tileset.height / 2

    const figureImg = new Konva.Image({
      width,
      height,
      image: tileset,
    })

    return figureImg.crop({
      x: this.getCropPosition().x,
      y: this.getCropPosition().y,
      width,
      height
    })
  }

  /*
    Проверить возможность хода
    @x - координата X
    @y - координата Y
    @cells - массив ячеек
  */
  canMove(x, y, cells) {
    if (x >= 0 && x < BOARD_CELLS_COUNT && y >= 0 && y < BOARD_CELLS_COUNT) {
      if (this.name !== 'P') {
        return this.getFigureSnapshotColor(cells[y][x]) === this.color ? false : true
      } else {
        return true
      }
    }
    return false
  }

}

export default Figure

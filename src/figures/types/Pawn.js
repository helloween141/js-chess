import Figure from '../../Figure'

class Pawn extends Figure {
  constructor(name, color, sprite) {
    super()
    this.name = name
    this.color = color
    this.image = this.createImage(sprite)
  }

  /*
    Получить все возможные ходы у пешки
    @cells: ячейки
    @movesOnly: флаг для получения только мест атаки (необходимо для проверки на шах)
  */
  getMoves(cells, movesOnly = false) {
    const sign = this.color === 'black' ? 1 : -1
    let { x, y } = this.getPositionPoint()
    let result = []
    
    // Движение
    if (!movesOnly) {
      if (this.canMove(x, y + 1 * sign, cells) && !cells[y + 1 * sign][x]) {
        result.push([x, y + 1 * sign])
        
        if ((y === 1 || y === 6) && this.canMove(x, y + 2 * sign, cells) && !cells[y + 2 * sign][x]) {
          result.push([x, y + 2 * sign])
        }
      }
    }
    
    // Атака по правой диагонали
    if ((this.canMove(x + 1 * sign, y + 1 * sign, cells) && cells[y + 1 * sign][x + 1 * sign] && 
        this.getFigureSnapshotColor(cells[y + 1 * sign][x + 1 * sign]) !== this.color) || movesOnly) {
      result.push([x + 1 * sign, y + 1 * sign])
    }

    // Атака по левой диагонали
    if ((this.canMove(x - 1 * sign, y + 1 * sign, cells) && cells[y + 1 * sign][x - 1 * sign] &&
        this.getFigureSnapshotColor(cells[y + 1 * sign][x - 1 * sign]) !== this.color) || movesOnly) {
      result.push([x - 1 * sign, y + 1 * sign])
    }
   
    return result
  }

  getCropPosition() {
    return {
      x: 320,
      y: this.color === 'black' ? 0 : 64,
    }
  }
}

export default Pawn

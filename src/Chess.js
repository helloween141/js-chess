import Board from './Board'
import AI from './players/AI'
import GameLog from './GameLog'
import Player from './players/Player'
import Human from './players/Human'
import Stage from './Stage'

class Chess {
  constructor() {
    this.stage = Stage.create('stage')
    this.board = new Board()
    this.gameLog = new GameLog()
    this.loop = null
    this.isUpdating = false
  }

  startGame(typePlayerOne = AI, typePlayerTwo = AI) {
    // Очистка
    if (this.board) {
      this._destroy()
    }
    // Инициализация игрового поля
    this.board.initialize()

    // Создание игроков
    const colors = this._rollColor()
    this.playerOne = new Player(typePlayerOne, 'Компьютер 1', colors.colorOne, this.board.getFiguresByColor(colors.colorOne))
    this.playerTwo = new Player(typePlayerTwo, 'Компьютер 2', colors.colorTwo, this.board.getFiguresByColor(colors.colorTwo))

    // Определение игрока, который ходит первым
    this.currentPlayer = this.playerOne.isCurrent ? this.playerOne : this.playerTwo
  
    // Если есть живой игрок, то создаем listener для stage
    if (typePlayerOne === Human || typePlayerTwo === Human) {
      this.stage.on('click', (e) => {       
        if (this.currentPlayer.type instanceof Human && !this.isUpdating) {
          let mousePosition = this.stage.getPointerPosition()
      
          let cellX = Math.round(mousePosition.x / 70) - 1
          let cellY = Math.round(mousePosition.y / 70) - 1  
          
          const figure = this.board.selectSpot(cellX, cellY, this.currentPlayer.color)
          if (figure) {
            const move = this.currentPlayer.type.getMove(this.board.cells, figure, cellX, cellY)
            this.gameLoop(move)
          }
          this.render()
        }
      }) 
    }

    if (this.currentPlayer.type instanceof AI) {
      this.gameLoop(this.currentPlayer.type.getMove(this.board.cells))
    }

    this.render()
  }
 
  gameLoop(move = null) {
    if (move) {
      this.isUpdating = true
      
      this.board.selectedFigure = this.board.cells[move.startY][move.startX].figure
      this.board.selectedFigure.prepareAnimation(move)

      this.update(move).then(() => {
        this.isUpdating = false
        window.cancelAnimationFrame(this.loop);

        // Запись хода в лог
        this.gameLog.addMoveInfo(this.currentPlayer.color, move)

        // Смена очереди после хода
        if (this.playerOne.isCurrent) {
          this.playerOne.isCurrent = false
          this.playerTwo.isCurrent = true
          this.currentPlayer = this.playerTwo
        } else {
          this.playerTwo.isCurrent = false
          this.playerOne.isCurrent = true
          this.currentPlayer = this.playerOne
        }

        // Вызов хода AI, если он существует
        if (this.currentPlayer.type instanceof AI) {
          this.gameLoop(this.currentPlayer.type.getMove(this.board.cells))
        }
      })
    }
  }

  update(move) {
    return new Promise(resolve => {
      const self = this
  
      window.requestAnimFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60)
      };
      
      (function animLoop(){
        self.loop = requestAnimFrame(animLoop);
        self.board.updateMove(move).then(result => {
          resolve(result)
        })
        self.render()
      })(); 

    })
  }

  _rollColor() {
    if (Math.round(Math.random())) {
      return {
        colorOne: 'white',
        colorTwo: 'black'
      }
    } else {
      return {
        colorOne: 'black',
        colorTwo: 'white'
      }
    }
  }

  _destroy() {
    this.stage.destroyChildren()
    this.gameLog.clear()
    window.cancelAnimationFrame(this.loop)    
  }

  render() {
    if (this.board) {
      this.board.render()
      this.stage.add(
        this.board.cellsLayer,
        this.board.figuresLayer,
        this.board.animLayer
      )
    }
  }
}

export default Chess

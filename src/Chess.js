import Board from './Board'
import AI from './players/AI'
import GameLog from './GameLog'
import Stage from './Stage'
import Human from './players/Human'
import Move from './Move'

class Chess {
  constructor() {
    this.stage = Stage.create('stage')
    this.board = new Board()
    this.gameLog = new GameLog()
    this.loop = null
    this.isUpdating = false
  }

  /*
    Начать игру
    @PlayerTypeOne - тип игрока №1
    @PlayerTypeTwo - тип игрока №2
  */
  startGame(gameMode = 1) {

    const Players = this.getPlayersTypes(gameMode)

    // Сборка мусора, если игра уже была создана
    if (this.board) {
      this._destroy()
    }
    
    // Инициализация игрового поля
    this.board.initialize()
    // Создание игроков
    const colors = this.rollColor()
    this.playerOne = new Players.playerTypeOne('Игрок 1', colors.colorOne, this.board.getFiguresByColor(colors.colorOne))
    this.playerTwo = new Players.playerTypeTwo('Игрок 2', colors.colorTwo, this.board.getFiguresByColor(colors.colorTwo))

    // Определение игрока, который ходит первым
    this.currentPlayer = this.playerOne.isCurrent ? this.playerOne : this.playerTwo

    // Если есть живой игрок, то создаем listener для stage
    if (this.playerOne.isHuman || this.playerTwo.isHuman) {
      let humanMoves = []
      this.stage.on('click', (e) => {    
        if (!this.isUpdating) {
          const mousePosition = this.stage.getPointerPosition()
          let cellX = Math.round(mousePosition.x / 70) - 1
          let cellY = Math.round(mousePosition.y / 70) - 1  

          const selectedCell = this.board.selectCell(cellX, cellY)

          // Ход
          if (humanMoves.length > 0 && humanMoves.find(m => m[1] === cellY && m[0] === cellX)) {
            const movePos = this.currentPlayer.getMovePosition(humanMoves, cellX, cellY)

            this.gameLoop(new Move(this.currentPlayer.selectedFigure, movePos.startPosPointer, movePos.endPosPointer))

            humanMoves = []
          }
          // Подсветка возможных ходов
          else if (selectedCell.getFigure() && selectedCell.getFigure().color === this.currentPlayer.color) {

            selectedCell.setSelect()    
            
            this.currentPlayer.selectedFigure = selectedCell.getFigure()

            humanMoves = this.currentPlayer.getAllPossibleMoves(selectedCell.getFigure(), this.getOpponentPlayer(), this.board.getSnapshot())
            
            humanMoves.forEach(move => this.board.cells[move[1]][move[0]].setHighlight())

            this.render()
          }
        }
      }) 
    }

    this.gameLoop()

    this.render()
  }

  /*
    Игровой цикл
    @move - текущий ход
  */
  gameLoop(move = null) {
    if (move) {
      this.isUpdating = true

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

        this.currentPlayer.figures = this.board.getFiguresByColor(this.currentPlayer.color)
        
        if (!this.checkCheckmate()) {
          this.gameLoop()
        }
        
      })
    } else {
      // Вызов хода AI, если он существует
      if (!this.currentPlayer.isHuman) {
          setTimeout(() => {
            const movePos = this.currentPlayer.getMovePosition(this.board.getSnapshot(), this.getOpponentPlayer())
            this.gameLoop(new Move(this.currentPlayer.selectedFigure, movePos.startPosPointer, movePos.endPosPointer))
          }, 1000)

      }
    }
  }

  /*
   Проверка на шах и мат
  */
  checkCheckmate() {
    const opponentMoves = this.getOpponentPlayer().getAttackMoves(this.board.getSnapshot())

    if (this.currentPlayer.checkSchach(opponentMoves)) {
      this.gameLog.addCustomInfo(`${this.getOpponentPlayer().color} set schach`)

      let checkmateFlag = true
      this.currentPlayer.figures.forEach(figure => {
        const currentPlayerMoves = this.currentPlayer.getAllPossibleMoves(figure, this.getOpponentPlayer(), this.board.getSnapshot())
        if (currentPlayerMoves.length > 0) {
          checkmateFlag = false
        }
      })
 
      if (checkmateFlag) {
        this.gameLog.addCustomInfo(`Game over! ${this.getOpponentPlayer().color} set checkmate`)
        return true
      }
    }
    return false
  }

  /*
    Глобальный апдейт
  */
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
          self.render()
        })
        self.render()
      })(); 

    })
  }

  getPlayersTypes(gameMode) {
    
    switch(gameMode) {
      case 2:
        return {
          playerTypeOne: Human,
          playerTypeTwo: AI,
        }
      case 3:
        return {
          playerTypeOne: AI,
          playerTypeTwo: AI,
        }
    }

    return {
      playerTypeOne: Human,
      playerTypeTwo: Human,
    }

  }

  /*
    Получить вражеского игрока
  */
  getOpponentPlayer() {
    return this.playerOne.isCurrent ? this.playerTwo : this.playerOne
  }

  /*
    Задать цвета игрокам
  */
  rollColor() {
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

  /*
    Сборка мусора
  */
  _destroy() {
    this.stage.destroyChildren()
    this.gameLog.clear()
    window.cancelAnimationFrame(this.loop)    
  }

  
  /*
    Отрисовка
  */
  render() {
    if (this.board) {
      this.board.render()
      this.stage.add(
        this.board.cellsLayer,
        this.board.figuresLayer
      )
    }
  }
}

export default Chess

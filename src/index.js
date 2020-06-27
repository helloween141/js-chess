import './style.css'
import Chess from './Chess'

const chess = new Chess()

document.getElementById('start').addEventListener('click', (e) => {
  const gameModeSelector = document.getElementById('game-mode')
  const gameModeValue = +gameModeSelector.options[gameModeSelector.selectedIndex].value

  chess.startGame(gameModeValue)
})





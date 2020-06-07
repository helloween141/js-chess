import './style.css'
import Chess from './Chess'

const chess = new Chess()
chess.startGame()

document.getElementById('start').addEventListener('click', (e) => {
  chess.startGame()
})





import './style.css'
import Chess from './Chess'

const chess = new Chess()

document.getElementById('start').addEventListener('click', (e) => {
  chess.startGame()
})





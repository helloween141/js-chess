import { STAGE_WIDTH, STAGE_HEIGHT } from './global'
import Konva from 'konva'
import './style.css'
import Chess from './Chess'

const chess = new Chess()
chess.startGame()

document.getElementById('start').addEventListener('click', (e) => {
  chess.startGame()
})





import { STAGE_WIDTH, STAGE_HEIGHT } from './global'
import Konva from 'konva'
import './style.css'
import Chess from './Chess'

const stage = new Konva.Stage({
  container: 'stage',
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
})

const chess = new Chess(stage)
chess.startGame()

document.getElementById('start').addEventListener('click', (e) => {
  chess.startGame()
});

stage.on('click', (e) => {
  let mousePos = stage.getPointerPosition()

  let cellX = Math.round(mousePos.x / 70) - 1
  let cellY = Math.round(mousePos.y  / 70) - 1
  chess.humanStep(cellX, cellY)  
  chess.render()
});







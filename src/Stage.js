import Konva from 'konva'
import { STAGE_WIDTH, STAGE_HEIGHT } from './global';

class Stage {
  static create(container) {
    return new Konva.Stage({
        container: container,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
    }) 
  }
}

export default Stage

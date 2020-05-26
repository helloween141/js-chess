import Pawn from './types/Pawn'
import Knight from './types/Knight'
import Rook from './types/Rook'
import Bishop from './types/Bishop'
import King from './types/King'
import Queen from './types/Queen'

class FigureFactory {
  static create({name, color, sprite}) {
    switch (name) {
      case 'P':
        return new Pawn(name, color, sprite) // Пешка
      case 'R':
        return new Rook(name, color, sprite) // Ладья
      case 'N':
        return new Knight(name, color, sprite) // Конь
      case 'B':
        return new Bishop(name, color, sprite) // Слон
      case 'K':
        return new King(name, color, sprite) // Король
      case 'Q':
        return new Queen(name, color, sprite) // Ферзь
    }
  }
}

export default FigureFactory

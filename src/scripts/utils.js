export const isOutOfBounds = (currTile, direction, size) => {
      // east
      if (direction === 1 && (currTile % size.columns) + 1 >= size.columns) {
            return true
      }
      // south
      if (
            (direction === size.columns) &
            (currTile + size.columns >= size.rows * size.columns)
      ) {
            return true
      }
      // north
      if (direction === -size.columns && currTile - size.columns < 0) {
            return true
      }
      // west
      if (direction === -1 && (currTile % size.columns) - 1 < 0) {
            return true
      }
}

export class PriorityQueue {
      constructor() {
            this.queue = []
      }

      put(item, fscore, hscore) {
            this.queue.push({item, fscore, hscore})
            this.queue.sort((a, b) => {
                  if (a.fscore !== b.fscore) {
                        return a.fscore - b.fscore
                  } else {
                        return a.hscore - b.hscore
                  }
            })
      }
      pop() {
            return this.queue.shift().item
      }

      isEmpty() {
            return this.queue.length === 0
      }

      peek() {
            return this.queue[0].item
      }
}

export const directionsList = (columns) => {
      return [1, columns, -columns, -1]
}

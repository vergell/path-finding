import {PriorityQueue, isOutOfBounds, directionsList} from "./utils"
const h = (tile1, tile2, columns) => {
      let x1 = Math.floor(tile1 / columns)
      let y1 = (tile1 % columns) + 1
      let x2 = Math.floor(tile2 / columns)
      let y2 = (tile2 % columns) + 1
      return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}
const maxInt = Number.MAX_SAFE_INTEGER
export const astar = (Tiles, size) => {
      let start = Tiles.find((tile) => tile.start).id
      let end = Tiles.find((tile) => tile.target).id
      let gscore = new Map()
      let fscore = new Map()
      let directions = directionsList(size.columns)
      let exploredArray = [start]

      let aPath = new Map()
      let path = []

      const open = new PriorityQueue()

      Tiles.forEach((tile) => {
            gscore.set(tile.id, maxInt)
            fscore.set(tile.id, maxInt)
      })
      gscore.set(start, 0)
      fscore.set(start, h(start, end, size.columns))

      open.put(start, fscore.get[start], fscore.get[start])
      while (!open.isEmpty()) {
            let currTile = open.pop()
            exploredArray.push(currTile)

            if (currTile === end) {
                  break
            }
            for (const direction of directions) {
                  let nextTile = currTile + direction
                  if (isOutOfBounds(currTile, direction, size)) {
                        continue
                  }
                  if (Tiles[nextTile].blocked) {
                        continue
                  }
                  let temp_gscore = gscore.get(currTile) + 1
                  let temp_fscore = temp_gscore + h(nextTile, end, size.columns)

                  if (temp_fscore < fscore.get(nextTile)) {
                        gscore.set(nextTile, temp_gscore)
                        fscore.set(nextTile, temp_fscore)
                        open.put(nextTile, temp_fscore, h(nextTile, end))
                        aPath.set(nextTile, currTile)
                  }
            }
      }
      if (exploredArray.includes(end)) {
            while (end != start) {
                  path.push(end)
                  end = aPath.get(end)
            }
      }
      return [exploredArray, path]
}

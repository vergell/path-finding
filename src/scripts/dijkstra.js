import {PriorityQueue, isOutOfBounds, directionsList} from "./utils"
const maxInt = Number.MAX_SAFE_INTEGER
export const dijkstra = (Tiles, size) => {
      let start = Tiles.find((tile) => tile.start).id
      let end = Tiles.find((tile) => tile.target).id
      let directions = directionsList(size.columns)
      let unvisited = new Map()
      let exploredArray = []

      Tiles.forEach((tile) => {
            unvisited.set(tile.id, maxInt)
      })
      unvisited.set(start, 0)
      let visited = new Map()

      let aPath = new Map()
      let path = []

      while (unvisited) {
            const currTile = minVal(unvisited)
            exploredArray.push(currTile)

            visited.set(currTile, unvisited.get(currTile))
            if (currTile === end) {
                  break
            }
            for (const direction of directions) {
                  let nextTile = currTile + direction
                  if (isOutOfBounds(currTile, direction, size)) {
                        continue
                  }
                  if (Tiles[nextTile].blocked || visited.has(nextTile)) {
                        continue
                  }

                  let tempD = unvisited.get(currTile) + 1
                  if (tempD < unvisited.get(nextTile)) {
                        unvisited.set(nextTile, tempD)
                        aPath.set(nextTile, currTile)
                  }
            }
            unvisited.delete(currTile)
      }
      if (exploredArray.includes(end)) {
            while (end != start) {
                  path.push(end)
                  end = aPath.get(end)
            }
      }
      return [exploredArray, path]
}
function minVal(map) {
      let minValue = Infinity // Initialize with a very large value
      let minKey = null

      // Iterate over map entries
      for (const [key, value] of map.entries()) {
            if (value < minValue) {
                  minValue = value
                  minKey = key
            }
      }

      return minKey
}

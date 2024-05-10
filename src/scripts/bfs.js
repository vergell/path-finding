import {isOutOfBounds, directionsList} from "./utils"
export const bfs = (Tiles, size) => {
      let start = Tiles.find((tile) => tile.start).id
      let end = Tiles.find((tile) => tile.target).id
      let frontier = [start]
      let exploredArray = [start]
      let bfsPath = new Map()
      let path = []
      let explored = new Set([start])
      let directions = directionsList(size.columns)
      Tiles[end].blocked = false
      while (frontier.length > 0) {
            let currTile = frontier.shift()
            if (currTile === end) {
                  break
            }
            for (const direction of directions) {
                  let nextTile = currTile + direction
                  if (isOutOfBounds(currTile, direction, size)) {
                        continue
                  }

                  if (explored.has(nextTile) || Tiles[nextTile].blocked) {
                        continue
                  }

                  exploredArray.push(nextTile)
                  frontier.push(nextTile)
                  explored.add(nextTile)
                  bfsPath.set(nextTile, currTile)
                  // console.log(currTile + direction)
            }
      }
      if (explored.has(end)) {
            while (end != start) {
                  path.push(end)
                  end = bfsPath.get(end)
            }
      }

      return [exploredArray, path]
}

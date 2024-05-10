export const clearTiles = (Tiles) => {
      Tiles.forEach((tile) => {
            tile.blocked = false
            tile.explored = false
            tile.path = false
      })
}

export const clearExplored = (Tiles) => {
      Tiles.forEach((tile) => {
            tile.explored = false
            tile.path = false
      })
}

export const animateExplored = (Tiles, explored, path, isAnimating) => {
      let index = 0
      let delay = 1
      length = explored.length
      clearExplored(Tiles)
      isAnimating.value = true

      function aniExplored() {
            if (index < length && isAnimating.value) {
                  Tiles[explored[index]].explored = true
                  index++
                  setTimeout(aniExplored, delay)
            } else {
                  index = 0
                  delay = 50
                  aniPath()
            }
      }

      function aniPath() {
            if (index < path.length && isAnimating.value) {
                  Tiles[path[index]].path = true
                  index++
                  setTimeout(aniPath, delay)
            } else {
                  isAnimating.value = false
            }
      }
      aniExplored()
}
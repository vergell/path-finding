<script setup>
import {ref, onMounted} from "vue"
import Tile from "./Tile.vue"
import {
      clearTiles,
      animateExplored,
      clearExplored,
      showPath,
} from "../scripts/toggles.js"
import {bfs} from "../scripts/bfs.js"
import {astar} from "../scripts/astar.js"
import {dijkstra} from "../scripts/dijkstra.js"
import Swal from "sweetalert2/dist/sweetalert2.js"
import image from "../assets/pfsample.png"
import dragpoints from "../assets/dragpoints.png"
const blockSize = 30

const dragList = ref(null)

const size = ref({
      rows: 0,
      columns: 0,
})
const isAnimating = ref(false)
const isMouseDown = ref(false)
const isPathFound = ref(false)
const GridRef = ref()
const Tiles = ref([])
const algorithms = ref([
      {
            id: 0,
            label: "Breadth First Search",
            alg: bfs,
      },
      {id: 1, label: "A* Algorithm", alg: astar},
      {id: 2, label: "Dijstra's Algorithm", alg: dijkstra},
])
const selectedAlg = ref(algorithms.value[1])

const tileClicked = (index) => {
      if (!Tiles.value[index].target) {
            Tiles.value[index].blocked = !Tiles.value[index].blocked
      }
}
const blockTile = (index) => {
      if (!Tiles.value[index].target) {
            Tiles.value[index].blocked = true
      }
}
const initializeTiles = () => {
      size.value.rows = Math.ceil(GridRef.value.offsetHeight / blockSize)
      size.value.columns = Math.ceil(GridRef.value.offsetWidth / blockSize)
      if (size.value.rows < 10) {
            size.value.rows = Math.ceil(GridRef.value.offsetHeight / blockSize)
      }
      if (size.value.rows % 2 === 0) {
            size.value.rows += 1
      }
      GridRef.value.style.setProperty("--rows", size.value.rows)
      GridRef.value.style.setProperty("--columns", size.value.columns)

      Tiles.value = Array.from(
            {length: size.value.rows * size.value.columns},
            (value, index) => ({
                  id: index,
                  blocked: false,
                  explored: false,
                  path: false,
                  start:
                        Math.ceil(
                              (size.value.rows * size.value.columns) / 2 -
                                    size.value.columns / 4
                        ) === index,
                  target:
                        Math.floor(
                              (size.value.rows * size.value.columns) / 2 +
                                    size.value.columns / 4
                        ) === index,
            })
      )
}

onMounted(() => {
      window.addEventListener("load", initializeTiles)
      window.addEventListener("resize", initializeTiles)

      setTimeout(() => {
            Swal.fire({
                  title: "Hold left click to draw blocks",
                  imageUrl: image,
                  confirmButtonText: "Okay",
            }).then(() => {
                  Swal.fire({
                        title: "Drag the starting and target tiles to move them freely.",
                        imageUrl: dragpoints,
                        confirmButtonText: "Cool",
                  })
            })
      }, 500)
})

const handleFindPath = () => {
      const target = Tiles.value.find((tile) => tile.target).id
      Tiles.value[target].blocked = false
      let explored, path
      if (isAnimating.value) {
            return
      }
      ;[explored, path] = selectedAlg.value.alg(Tiles.value, size.value)
      animateExplored(Tiles.value, explored, path, isAnimating)
      isPathFound.value = true
}
const handleClearTiles = () => {
      isAnimating.value = false

      clearTiles(Tiles.value)
      isPathFound.value = false
}
const handleRandomBlocks = () => {
      isPathFound.value = false
      isAnimating.value = false
      clearExplored(Tiles.value)
      const array = []
      for (let i = 0; i < size.value.rows * size.value.columns; i++) {
            array.push(i)
            if (!Tiles.value[i].target) {
                  Tiles.value[i].blocked = Math.random() < 0.33
            }
      }
}
const handleSelectAlgo = () => {
      isAnimating.value = false
      clearExplored(Tiles.value)
}
const handleMouseDown = () => {
      const start = Tiles.value.find((tile) => tile.start).id
      const target = Tiles.value.find((tile) => tile.target).id
      if (dragList.value !== start && dragList.value !== target) {
            isMouseDown.value = true
      }
}
const handleMouseEnter = (index) => {
      if (isMouseDown.value) {
            blockTile(index)
            isAnimating.value = false
            clearExplored(Tiles.value)
      }
      if (
            dragList.value !== null &&
            Tiles.value[dragList.value].start &&
            !Tiles.value[index].target
      ) {
            Tiles.value[dragList.value].start = false
            Tiles.value[index].start = true
            dragList.value = index
            handleShowPath()
      } else if (
            dragList.value !== null &&
            Tiles.value[dragList.value].target &&
            !Tiles.value[index].start
      ) {
            Tiles.value[dragList.value].target = false
            Tiles.value[index].target = true
            dragList.value = index
            handleShowPath()
      }
}

const handleShowPath = () => {
      if (isPathFound.value) {
            const [_, path] = selectedAlg.value.alg(Tiles.value, size.value)
            showPath(Tiles.value, path)
      }
}
const handleMouseUp = () => {
      dragList.value = null
}
</script>

<template>
      <div class="nav">
            <h1 class="title">PATH FINDING</h1>
            <select
                  class="select"
                  v-model="selectedAlg"
                  @change="handleSelectAlgo">
                  <option
                        v-for="alg in algorithms"
                        :key="alg.id"
                        :class="alg"
                        :value="alg">
                        {{ alg.label }}
                  </option>
            </select>
            <button class="button" @click="handleClearTiles">
                  Clear tiles
            </button>
            <button class="button" @click="handleFindPath">Find path</button>
            <button class="button" @click="handleRandomBlocks">
                  Randomize blocks
            </button>
      </div>
      <div
            @mousedown.left="handleMouseDown"
            @mouseup.left="isMouseDown = false"
            @mouseleave="isMouseDown = false"
            class="grid"
            ref="GridRef">
            <Tile
                  v-for="tile in Tiles"
                  v-bind:key="tile.id"
                  @mousedown="dragList = tile.id"
                  @mouseenter="handleMouseEnter(tile.id)"
                  @mouseup="handleMouseUp"
                  @click="tileClicked(tile.id)"
                  :tile="tile"
                  :isPathFound="isPathFound" />
      </div>
</template>

<style scoped>
.nav {
      background: #27374d;
      color: white;
      height: 10%;
      display: flex;
      align-items: center;
      justify-content: start;
}
.grid {
      height: 90%;
      display: grid;
      grid-template-rows: repeat(var(--rows), 1fr);
      grid-template-columns: repeat(var(--columns), 1fr);
      background: #eee2e2;
      gap: 1px;
}

.title {
      margin: 1.7rem;
      margin-right: 3rem;
}
.select {
      margin: 0 1em;
      display: inline-block;
      outline: none;
      cursor: pointer;
      font-weight: 500;
      border: 1px solid transparent;
      border-radius: 2px;
      height: 36px;
      line-height: 34px;
      font-size: 1em;
      color: #ffffff;
      background-color: #526d82;
      transition: background-color 0.2s ease-in-out 0s,
            opacity 0.2s ease-in-out 0s;
      padding: 0 18px;
}
.button {
      white-space: nowrap;
      margin: 0 1em;
      display: inline-block;
      outline: none;
      cursor: pointer;
      font-weight: 500;
      border: 1px solid transparent;
      border-radius: 2px;
      height: 36px;
      line-height: 34px;
      font-size: 1em;
      color: #ffffff;
      background-color: #526d82;
      transition: background-color 0.2s ease-in-out 0s,
            opacity 0.2s ease-in-out 0s;
      padding: 0 18px;
}
.button:hover {
      background-color: #164863;
}
</style>

<script setup>
import {ref, onMounted} from "vue"
import Tile from "./Tile.vue"
import {clearTiles, animateExplored, clearExplored} from "../scripts/toggles.js"
import {bfs} from "../scripts/bfs.js"
import {astar} from "../scripts/astar.js"
import {dijkstra} from "../scripts/dijkstra.js"
const blockSize = 32

const size = ref({
      rows: 0,
      columns: 0,
})
const isAnimating = ref(false)
const isMouseDown = ref(false)
const GridRef = ref()
const Tiles = ref([])
const algorithms = ref([
      {id: 0, label: "Breadth First Search"},
      {id: 1, label: "A* Algorithm"},
      {id: 2, label: "Dijstra's Algorithm"},
])
const selectedAlg = ref(algorithms.value[1])

const tileClicked = (index) => {
      if (!Tiles.value[index].target) {
            Tiles.value[index].blocked = !Tiles.value[index].blocked
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
})

const handleFindPath = () => {
      let explored, path
      if (isAnimating.value) {
            return
      }
      switch (selectedAlg.value.id) {
            case 0:
                  ;[explored, path] = bfs(Tiles.value, size.value)
                  animateExplored(Tiles.value, explored, path, isAnimating)
                  break
            case 1:
                  ;[explored, path] = astar(Tiles.value, size.value)
                  animateExplored(Tiles.value, explored, path, isAnimating)
                  break
            case 2:
                  ;[explored, path] = dijkstra(Tiles.value, size.value)
                  animateExplored(Tiles.value, explored, path, isAnimating)
                  break
      }
}
const handleClearTiles = () => {
      isAnimating.value = false
      console.log("isanimating in handlecleartiles", isAnimating.value)
      clearTiles(Tiles.value)
}
const handleRandomBlocks = () => {
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
            @mousedown.left="isMouseDown = true"
            @mouseup.left="isMouseDown = false"
            @mouseleave="isMouseDown = false"
            class="grid"
            ref="GridRef">
            <Tile
                  v-for="tile in Tiles"
                  v-bind:key="tile.id"
                  :tileClicked="tileClicked"
                  :tile="tile"
                  :isMouseDown="isMouseDown" />
      </div>
</template>

<style scoped>
.nav {
      background: #27374d;
      color: white;
      height: 14%;
      display: flex;
      align-items: center;
      justify-content: start;
}
.grid {
      height: 86%;
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

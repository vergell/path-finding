<script setup>
import {ref} from "vue"

const props = defineProps(["tile", "tileClicked", "isMouseDown"])
const isDragging = ref(false)
</script>

<template>
      <div
            :class="[
                  'tiles',
                  props.tile.blocked ? 'blocked' : '',
                  props.tile.explored ? ' explored' : '',
                  props.tile.path ? 'path' : '',
                  props.tile.start ? 'start' : '',
                  props.tile.target ? 'target' : '',
            ]"
            :draggable="props.tile.start ? 'true' : 'false'"
            @dragstart="isDragging = true"
            @click="props.tileClicked(props.tile.id)"
            @mouseenter="
                  props.isMouseDown &&
                  !props.blocked &&
                  !isDragging &&
                  !props.tile.target
                        ? (props.tile.blocked = true)
                        : null
            "></div>
</template>
<style scoped>
.tiles {
      user-select: none;
      background: #ffffff;
      animation-name: defaultAnimation;
      cursor: pointer;
      animation-duration: 0.2s;
      animation-timing-function: ease-out;
      animation-delay: 0;
      animation-direction: alternate;
      animation-fill-mode: none;
      animation-play-state: running;
}
.blockedTop {
      border-top: 2px solid #9f9f9f;
}
.blockedRight {
      border-left: 2px solid #9f9f9f;
}
.blocked {
      background: #1c222b;
      animation-name: blockAnimation;
}
.explored {
      animation-duration: 1.1s;

      background: #30e3df;
      animation-name: exploredAnimation;
}
.path {
      background: #74e291;
      padding: 3px;
      animation-name: pathAnimation;
}
.start {
      animation-name: none;

      background: #0e46a3;
}
.target {
      animation-name: none;

      background: #ff004d;
}
@keyframes breathing {
      0% {
            transform: scale(0.8);
      }
      25% {
            transform: scale(1.1);
      }

      65% {
            transform: scale(0.8);
      }

      100% {
            transform: scale(1.1);
      }
}
@keyframes exploredAnimation {
      0% {
            transform: scale(0.2);
            background-color: #d61355;
            border-radius: 100%;
      }
      50% {
            background-color: #f94a29;
      }
      90% {
            background-color: #fce22a;
      }
      100% {
            transform: scale(1.3);
            background-color: #30e3df;
      }
}
@keyframes pathAnimation {
      0% {
            transform: scale(0.5);
            background-color: #141e46;
      }
      50% {
            background-color: #41b06e;
      }

      75% {
            transform: scale(1.5);
            background-color: #8decb4;
      }
      100% {
            transform: scale(0.96);
            background-color: #8decb4;
      }
}
@keyframes blockAnimation {
      0% {
            transform: scale(0.2);
            background-color: #e1f7f5;
            border-radius: 100%;
      }
      50% {
            background-color: #9ac8cd;
      }

      100% {
            transform: scale(1.3);
            background-color: #0e46a3;
      }
}
@keyframes defaultAnimation {
      0% {
            transform: scale(0.2);
            background-color: #0e46a3;
            border-radius: 100%;
      }
      50% {
            background-color: #9ac8cd;
      }

      100% {
            transform: scale(1.3);
            background-color: #e1f7f5;
      }
}
</style>

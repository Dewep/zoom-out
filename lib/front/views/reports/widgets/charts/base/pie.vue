<template>
  <div class="chart-pie">
    <svg
      viewBox="0 0 64 64"
      class="pie"
    >
      <circle
        v-for="(part, index) in parts"
        :key="index"
        r="25%"
        cx="50%"
        cy="50%"
        fill="transparent"
        :style="partStyle(part, index)"
        @mouseenter="selected = part"
        @mouseleave="selected = null"
      />
    </svg>
    <div class="labels">
      <div
        v-for="(part, index) in parts"
        :key="index"
        class="label"
      >
        <div :style="{ background: part.color }" />
        <span>
          <i>{{ part.label }}</i>: <b>{{ part.value }}</b> ({{ (part.percent > 100 ? 100 : part.percent).toPrecision(2) }}%)
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { range } from '@/utils'
import { base as defaultColors, random } from '@/utils/colors'

export default {
  name: 'ChartPie',

  props: {
    values: {
      type: Array,
      required: true
    },
    strokeWidth: {
      type: Number,
      default: 10
    }
  },

  data () {
    return {
      selected: null
    }
  },

  computed: {
    total () {
      return this.values.reduce((acc, part) => acc + part.value, 0)
    },
    colors () {
      const colors = defaultColors.slice(0, this.values.length)
        .map(e => e[0])
        .map(([r, g, b]) => `rgba(${r}, ${g}, ${b})`)
      if (this.values.length > defaultColors.length) {
        colors.push(...range(this.values.length - defaultColors.length).map(_ => random()))
      }
      return colors
    },
    parts () {
      return this.values.map(({ value, label, color }, index) => ({
        percent: this.total ? value / this.total * 101 : 0,
        color: color || this.colors[index],
        value,
        label
      }))
    }
  },

  methods: {
    partStyle (part, index) {
      const stroke = part.color
      const strokeDasharray = `${part.percent} 100`
      const strokeDashoffset = -this.parts.slice(0, index).reduce((acc, part) => acc + part.percent, 0)
      const strokeWidth = this.strokeWidth
      return { stroke, strokeDasharray, strokeDashoffset, strokeWidth }
    }
  }
}
</script>

<style lang="scss">
@import 'variables.scss';

.chart-pie {
  display: flex;
  justify-content: center;
  position: relative;

  svg.pie {
    width: 300px;
    border-radius: 50%;

    circle {
      fill: none;
      stroke: gold;
      stroke-width: 10;
      transition: stroke-width;
      animation: rotate,stroke-width 1.5s ease-in;
    }
  }

  .labels {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .label {
      font-size: small;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: .1rem;
      background: transparent;

      div {
        display: inline;
        border-radius: 50%;
        height: 15px;
        width: 15px;
        margin: .1rem .5rem .1rem .1rem;
      }
    }
  }

  mark {
    position: absolute;
  }
}

</style>

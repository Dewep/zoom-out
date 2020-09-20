<template>
  <div
    v-if="values.length"
    ref="chart"
    class="reports-widgets-charts-area"
  >
    <svg
      ref="svg"
      :viewBox="`0 0 ${width} 300`"
      version="1.1"
      preserveAspectRatio="xMinYMin meet"
    >
      <defs>
        <linearGradient
          :id="`bg-gradient-${_uid}`"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop
            :stop-color="maxStopColor"
            offset="0%"
          />
          <stop
            :stop-color="minStopColor"
            offset="100%"
          />
        </linearGradient>
      </defs>
      <g
        :transform="`translate(${paddingLeftWidth}, 0)`"
        class="axis"
      >
        <g
          v-for="y in yAxis"
          :key="y.pos"
          :transform="`translate(0, ${y.pos})`"
        >
          <line
            :x2="mainAreaWidth"
            y2="0"
          />
          <text
            x="-5"
            y="0"
            dy=".32em"
            text-align="left"
            style="text-anchor: end"
          >
            {{ y.text }}
          </text>
        </g>
      </g>
      <g
        class="axis"
        transform="translate(0, 280)"
      >
        <g
          v-for="x in xAxis"
          :key="x.pos"
          :transform="`translate(${x.pos}, 0)`"
        >
          <line
            y2="6"
            x2="0"
          />
          <text
            v-show="x.display"
            y="9"
            x="0"
            dy=".71em"
            style="text-anchor: middle"
          >
            {{ x.text }}
          </text>
        </g>
        <path
          :d="`M${paddingLeftWidth},6V0H${width - paddingRightWidth}V6`"
        />
      </g>
      <g>
        <path
          :d="areaPath"
          :fill="`url(#bg-gradient-${_uid})`"
        />
      </g>
      <g
        v-if="selectedDot"
        :transform="`translate(${selectedDot.x}, 20)`"
        class="axis axis-selected"
      >
        <line
          x2="0"
          y2="260"
        />
      </g>
      <g>
        <circle
          v-for="dot in dots"
          :key="dot.index"
          :cx="dot.x"
          :cy="dot.y"
          :r="selectedDot && selectedDot.index === dot.index ? 4 : 3"
        />
      </g>
      <!-- pointer-events="visible" -->
      <g
        @mouseenter="cursorMove"
        @mousemove="cursorMove"
        @mouseleave="mousePosition = null"
      >
        <path
          :d="bgAreaPath"
          fill="transparent"
        />
      </g>
    </svg>
    <div
      v-if="selectedDot"
      :style="selectedInfoStyle"
      class="selected-info"
    >
      <slot :selectedDot="selectedDot">
        <b>{{ selectedDot.value }}</b><br>
        <b>{{ selectedDot.label }}</b>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    values: {
      type: Array,
      required: true
    },
    defaultMinX: {
      type: Number,
      default: null
    },
    defaultMaxX: {
      type: Number,
      default: null
    },
    defaultMinY: {
      type: Number,
      default: null
    },
    defaultMaxY: {
      type: Number,
      default: null
    },
    colorMin: {
      type: Array,
      default: () => [25, 103, 210]
    },
    colorMax: {
      type: Array,
      default: () => [68, 98, 208]
    }
  },
  data () {
    return {
      paddingLeftWidth: 30,
      paddingRightWidth: 20,
      width: 850,
      mousePosition: null
    }
  },
  computed: {
    mainAreaWidth () {
      return this.width - this.paddingLeftWidth - this.paddingRightWidth
    },
    minX () {
      return this.defaultMinX == null ? 0 : this.defaultMinX
    },
    maxX () {
      return this.defaultMaxX == null ? this.values[this.values.length - 1] : this.defaultMaxX
    },
    numberX () {
      return this.values.length
    },
    maxY () {
      return this.defaultMaxY == null ? Math.round(this.values.reduce((acc, bar) => acc > bar.value ? acc : bar.value, this.values[0].value) * 1.05) : this.defaultMaxY
    },
    minY () {
      return this.defaultMinY == null ? this.values.reduce((acc, bar) => acc < bar.value ? acc : bar.value, this.values[0].value) : this.defaultMinY
    },
    minStopColor () {
      return this.interpolateColor(0)
    },
    maxStopColor () {
      return this.interpolateColor(this.maxY - this.minY)
    },
    numberY () {
      return this.maxY - this.minY
    },
    valueWidth () {
      return this.mainAreaWidth / this.numberX
    },
    xAxis () {
      return this.dots.map((dot, index) => ({
        pos: this.paddingLeftWidth + this.valueWidth * index + this.valueWidth / 2,
        text: dot.label,
        display: true
      })).filter((y, index, array) => index % (Math.ceil(array.length / 10)) === 0)
    },
    yAxis () {
      return this.range(this.numberY + 1)
        .map(offset => ({
          pos: 20 + (260 / this.numberY) * offset,
          text: this.minY + this.numberY - offset
        })).filter((y, index, array) => index % (Math.ceil(array.length / 15)) === 0)
    },
    dots () {
      return this.values.map((dot, index) => ({
        ...dot,
        index,
        x: this.paddingLeftWidth + index * this.valueWidth + this.valueWidth / 2,
        y: Math.round(20 + (260 / this.numberY) * (this.numberY - (dot.value - this.minY)))
      }))
    },
    selectedDot () {
      if (!this.mousePosition) {
        return null
      }
      const mouseX = this.mousePosition.x
      const halfValueWidth = this.valueWidth / 2
      return this.dots.find(dot => mouseX > dot.x - halfValueWidth && mouseX < dot.x + halfValueWidth)
    },
    selectedDotIsLeftSide () {
      return this.selectedDot && this.selectedDot.x < (this.width / 2)
    },
    selectedInfoStyle () {
      if (!this.selectedDot) {
        return null
      }
      if (this.mousePosition.x < (this.width / 2)) {
        return { left: Math.max(this.mousePosition.x, this.selectedDot.x) + 15 + 'px' }
      }
      return { right: this.width - Math.min(this.mousePosition.x, this.selectedDot.x) + 15 + 'px' }
    },
    areaPath () {
      let path = ''
      path += 'M' + (this.paddingLeftWidth + this.valueWidth * 0) + ',' + (20 + (260 / this.numberY) * this.numberY)
      path += 'L' + (this.paddingLeftWidth + this.valueWidth * 0) + ',' + this.dots[0].y
      for (const dot of this.dots) {
        path += 'L' + dot.x + ',' + dot.y
      }
      path += 'L' + (this.paddingLeftWidth + this.valueWidth * this.numberX) + ',' + this.dots[this.dots.length - 1].y
      path += 'L' + (this.paddingLeftWidth + this.valueWidth * this.numberX) + ',' + (20 + (260 / this.numberY) * this.numberY)
      path += 'Z'
      return path
    },
    bgAreaPath () {
      let path = ''
      path += 'M' + this.paddingLeftWidth + ',' + (20 + (260 / this.numberY) * this.numberY)
      path += 'L' + this.paddingLeftWidth + ',' + 20
      path += 'L' + (this.paddingLeftWidth + this.valueWidth * this.numberX) + ',' + 20
      path += 'L' + (this.paddingLeftWidth + this.valueWidth * this.numberX) + ',' + (20 + (260 / this.numberY) * this.numberY)
      path += 'Z'
      return path
    }
  },
  mounted () {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateWidth)
  },
  methods: {
    interpolateColor (value) {
      const r = Math.round(this.colorMin[0] + value * 1 / this.numberY * (this.colorMax[0] - this.colorMin[0]))
      const g = Math.round(this.colorMin[1] + value * 1 / this.numberY * (this.colorMax[1] - this.colorMin[1]))
      const b = Math.round(this.colorMin[2] + value * 1 / this.numberY * (this.colorMax[2] - this.colorMin[2]))
      return `rgba(${r},${g},${b},0.8)`
    },
    cursorMove (event) {
      if (this.$refs.svg) {
        const bound = this.$refs.svg.getBoundingClientRect()
        const x = event.clientX - bound.left - this.$refs.svg.clientLeft
        const y = event.clientY - bound.top - this.$refs.svg.clientTop
        this.mousePosition = { x, y }
      }
    },
    updateWidth () {
      if (this.$refs.chart) {
        this.width = this.$refs.chart.scrollWidth
      }
    },
    range (length) {
      return Array.from({ length }).map((_, i) => i)
    }
  }
}
</script>

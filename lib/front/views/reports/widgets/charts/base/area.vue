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
      @click="onClick"
    >
      <defs>
        <linearGradient
          v-for="(gradientColor, index) in gradientColors"
          :id="`bg-gradient-${_uid}-${index}`"
          :key="`bg-gradient-${_uid}-${index}`"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop
            :stop-color="gradientColor.max"
            offset="0%"
          />
          <stop
            :stop-color="gradientColor.min"
            offset="100%"
          />
        </linearGradient>
      </defs>
      <g
        :transform="`translate(${paddingLeftWidth}, 0)`"
        class="axis"
      >
        <line v-if="limit" class="limit" :x2="mainAreaWidth" :y1="limitY" :y2="limitY" />

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
      <g
        v-for="(areaPath, index) in areaPaths"
        :key="`area-path-${index}`"
      >
        <path
          :d="areaPath"
          :fill="`url(#bg-gradient-${_uid}-${index})`"
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
        <b>{{ selectedDot.valueSum }}</b><br>
        <b>{{ selectedDot.label }}</b>
      </slot>
    </div>
  </div>
</template>

<script>
import { base as defaultColors } from '@/utils/colors'

function sum (array) {
  return array.reduce((a, b) => a + b, 0)
}

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
    colors: {
      type: Array,
      default: () => defaultColors
    },
    limit: {
      type: Number,
      default: null
    },
    onDotClick: {
      type: Function,
      default: null
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
    limitY () {
      return Math.round(20 + (260 / this.numberY) * (this.numberY - (this.limit - this.minY)))
    },
    aggregatedValues () {
      return this.values.map(item => {
        return {
          ...item,
          valueSum: sum(item.value)
        }
      })
    },
    mainAreaWidth () {
      return this.width - this.paddingLeftWidth - this.paddingRightWidth
    },
    minX () {
      return this.defaultMinX == null ? 0 : this.defaultMinX
    },
    maxX () {
      return this.defaultMaxX == null ? this.aggregatedValues.length - 1 : this.defaultMaxX
    },
    numberX () {
      return this.values.length
    },
    minY () {
      if (this.defaultMinY !== null) {
        return this.defaultMinY
      }

      return this.aggregatedValues.reduce((acc, bar) => acc < bar.valueSum ? acc : bar.valueSum, this.aggregatedValues[0].valueSum)
    },
    maxY () {
      if (this.defaultMaxY !== null) {
        return this.defaultMaxY
      }
      let maxValue = this.aggregatedValues.reduce((acc, bar) => acc > bar.valueSum ? acc : bar.valueSum, this.aggregatedValues[0].valueSum)
      if (maxValue === this.minY) {
        maxValue += 1
      }
      return Math.ceil(maxValue * 1.05)
    },
    gradientColors () {
      return this.colors.map(colors => {
        return {
          min: this.interpolateColor(colors, 0),
          max: this.interpolateColor(colors, this.maxY - this.minY)
        }
      })
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
      return this.aggregatedValues.map((dot, index) => ({
        ...dot,
        index,
        x: this.paddingLeftWidth + index * this.valueWidth + this.valueWidth / 2,
        y: Math.round(20 + (260 / this.numberY) * (this.numberY - (dot.valueSum - this.minY)))
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
    areaPaths () {
      return this.aggregatedValues[0].value.map((_, valueIndex) => {
        const points = this.dots.map(dot => {
          let value = 0
          let valueIncluded = 0
          for (let index = 0; index <= valueIndex; index++) {
            valueIncluded += dot.value[index]
            if (index < valueIndex) {
              value += dot.value[index]
            }
          }
          return {
            x: dot.x,
            yStart: Math.round(20 + (260 / this.numberY) * (this.numberY - (valueIncluded - this.minY))),
            yEnd: Math.round(20 + (260 / this.numberY) * (this.numberY - (value - this.minY)))
          }
        })

        let path = ''
        path += 'M' + (this.paddingLeftWidth + this.valueWidth * 0) + ',' + points[0].yEnd // (20 + (260 / this.numberY) * this.numberY)
        path += 'L' + (this.paddingLeftWidth + this.valueWidth * 0) + ',' + points[0].yStart
        for (const dot of points) {
          path += 'L' + dot.x + ',' + dot.yStart
        }
        path += 'L' + (this.paddingLeftWidth + this.valueWidth * this.numberX) + ',' + points[points.length - 1].yStart
        path += 'L' + (this.paddingLeftWidth + this.valueWidth * this.numberX) + ',' + points[points.length - 1].yEnd
        for (const dot of points.reverse()) {
          path += 'L' + dot.x + ',' + dot.yEnd
        }
        path += 'Z'
        return path
      })
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
    interpolateColor (colors, value) {
      const r = Math.round(colors[0][0] + value * 1 / this.numberY * ((colors[1] || colors[0])[0] - colors[0][0]))
      const g = Math.round(colors[0][1] + value * 1 / this.numberY * ((colors[1] || colors[0])[1] - colors[0][1]))
      const b = Math.round(colors[0][2] + value * 1 / this.numberY * ((colors[1] || colors[0])[2] - colors[0][2]))
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
    },
    onClick () {
      if (this.selectedDot && this.onDotClick) {
        this.onDotClick(this.selectedDot)
      }
    }
  }
}
</script>

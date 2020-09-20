<template>
  <ReportsWidgetCard
    :report="report"
    :filters="filters"
    query="stats"
    title="Comparaison des KPIs"
  >
    <template v-slot:default="slotProps">
      <ReportsWidgetPreviousPeriod
        v-bind="slotProps"
        :fields="fields"
      />
    </template>
  </ReportsWidgetCard>
</template>

<script>
import ReportsWidgetCard from '@/views/reports/widgets/card.vue'
import ReportsWidgetPreviousPeriod from '@/views/reports/widgets/previous-period.vue'

export default {
  components: {
    ReportsWidgetCard,
    ReportsWidgetPreviousPeriod
  },

  props: {
    report: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      fields: {
        count: {
          name: 'Nombre de visioconférences'
        },
        nbMembersAvg: {
          name: 'Nombre d\'intervenants moyen',
          format: value => {
            if (Math.round(value) === value) {
              return value
            }
            return `Entre ${Math.floor(value)} et ${Math.ceil(value)}`
          }
        },
        durationSum: {
          name: 'Durée totale',
          format: value => {
            const minutes = Math.round(value)
            if (minutes > 60) {
              const hours = Math.floor(minutes / 60)
              const remainingMinutes = minutes - hours * 60
              return `${hours}h${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}`
            }
            return minutes + ' min'
          }
        },
        durationAvg: {
          name: 'Durée moyenne',
          format: value => {
            const minutes = Math.round(value)
            if (minutes > 60) {
              const hours = Math.floor(minutes / 60)
              const remainingMinutes = minutes - hours * 60
              return `${hours}h${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}`
            }
            return minutes + ' min'
          }
        }
      }
    }
  }
}
</script>

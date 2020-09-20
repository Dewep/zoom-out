<template>
  <ReportsWidgetCard
    :report="report"
    :filters="filters"
    query="history"
    title="Nombre de visioconférences"
    class="column col-12"
  >
    <template v-slot:default="slotProps">
      <ReportsWidgetDatedaySeries
        v-bind="slotProps"
        :fields="fields"
      >
        <template v-slot:default="{ selectedDot }">
          <center>
            <small>{{ selectedDot.labelLong }}</small><br>
            <b>{{ selectedDot.value }} visioconférences</b>
          </center>
        </template>
      </ReportsWidgetDatedaySeries>
    </template>
  </ReportsWidgetCard>
</template>

<script>
import ReportsWidgetCard from '@/views/reports/widgets/card/component.vue'
import ReportsWidgetDatedaySeries from '@/views/reports/widgets/dateday-series.vue'

export default {
  components: {
    ReportsWidgetCard,
    ReportsWidgetDatedaySeries
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
        valueSlug: 'count'
      }
    }
  }
}
</script>

<template>
  <div id="reports-topbar-global-filters-date">
    <div
      v-if="!loseFocus"
      class="dropdown"
    >
      <a
        class="btn btn-primary dropdown-toggle"
        tabindex="0"
      >
        <i class="fa-calendar-alt fas mr-2" />
        {{ labelTitle }}
        <i class="fa-angle-down fas ml-2" />
      </a>
      <ul class="menu text-left">
        <li
          v-for="(label, labelSlug) in labels"
          :key="labelSlug"
          class="menu-item"
        >
          <a
            href="#"
            :class="{ active: labelSlug === dateType }"
            @click.prevent="selectNewDate(labelSlug)"
          >
            {{ label }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import encoder from '@/utils/encoder'

export default {
  props: {
    report: {
      type: Object,
      default: null
    },
    filters: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      labels: {
        'current-month': 'Mois courant',
        'last-month': 'Mois dernier',
        'last-30-days': '30 derniers jours',
        'last-90-days': '90 derniers jours'
        // custom: 'Personnalisé'
      },
      loseFocus: false
    }
  },

  computed: {
    dateType () {
      return (this.filters.date && this.filters.date[0]) || 'last-30-days'
    },
    labelTitle () {
      if (this.dateType === 'custom') {
        return '...'
      }
      return this.labels[this.dateType] || null
    }
  },

  methods: {
    selectNewDate (dateType) {
      if (dateType === 'custom') {
        // ...
        return
      }
      this.$router.push({
        name: this.$router.currentRoute.name,
        params: {
          filtersQuery: encoder.encode({ ...this.filters, date: [dateType] })
        }
      })
      this.loseFocus = true
      setTimeout(() => {
        this.loseFocus = false
      })
    }
  }
}
</script>

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
          v-for="(label, labelSlug) in availableDateFilters"
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

      <div class="modal" id="modal-id" :class="{ active: isCustomModalOpen }">
        <a class="modal-overlay" aria-label="Close" @click="closeCustomModal" />
        <div class="modal-container">
          <div class="modal-header">
            <a class="btn btn-clear float-right" aria-label="Close" @click="closeCustomModal"></a>
            <div class="modal-title h5">
              Selectionnez une date
            </div>
          </div>
          <div class="modal-body">
            <div class="content">
              <div class="input-group">
                <span class="input-group-addon addon-lg">
                  Après le *
                </span>
                <input v-model="date.from" type="datetime-local" class="form-input input-lg">
              </div>
              <div class="input-group mt-2">
                <span class="input-group-addon addon-lg">
                  Avant le
                </span>
                <input v-model="date.to" type="datetime-local" class="form-input input-lg">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="confirmCustomModal">
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
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
        'last-hour': 'Dernière heure',
        'last-24h': 'Dernières 24h',
        'current-month': 'Mois courant',
        'last-month': 'Mois dernier',
        'last-7-days': '7 derniers jours',
        'last-30-days': '30 derniers jours',
        'last-90-days': '90 derniers jours',
        'custom': 'Personnalisé'
      },
      loseFocus: false,
      isCustomModalOpen: false,
      date: {}
    }
  },

  computed: {
    availableDateFilters () {
      return this.labels
    },
    dateType () {
      return (this.filters.date && this.filters.date[0]) || 'last-30-days'
    },
    labelTitle () {
      if (this.dateType === 'custom') {
        return `du ${DateTime.fromISO(this.filters.date[1]).toLocaleString(DateTime.DATETIME_SHORT)}` +
          (this.filters.date[2] ? ` au ${DateTime.fromISO(this.filters.date[2]).toLocaleString(DateTime.DATETIME_SHORT)}` : ' à aujourd\'hui')
      }
      return this.labels[this.dateType] || null
    }
  },

  methods: {
    selectNewDate (dateType) {
      if (dateType === 'custom') {
        this.isCustomModalOpen = true
        return
      }

      this.$router.push({
        name: this.$router.currentRoute.name,
        params: {
          query: encoder.encode({ ...this.filters, date: [dateType] })
        }
      })
      this.loseFocus = true
      setTimeout(() => {
        this.loseFocus = false
      })
    },
    closeCustomModal () {
      this.date = {}
      this.isCustomModalOpen = false
    },
    confirmCustomModal () {
      if (!this.date.from) {
        this.closeCustomModal()
        return
      }

      this.isCustomModalOpen = false
      const date = ['custom', this.date.from, this.date.to]
      this.$router.push({
        name: this.$router.currentRoute.name,
        params: {
          query: encoder.encode({ ...this.filters, date })
        }
      })
    }
  }
}
</script>

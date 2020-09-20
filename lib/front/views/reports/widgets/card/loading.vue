<template>
  <div class="reports-widget-card-waiting">
    <span
      v-if="error"
      class="label label-error pointer"
      @click.prevent="$emit('reload')"
    >
      {{ error }}
    </span>
    <span v-else>
      Chargement
    </span>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    error: {
      type: String,
      default: null
    }
  }
}
</script>

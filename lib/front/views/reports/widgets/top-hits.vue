<template>
  <div>
    <table class="table reports-widget-previous-period">
      <thead>
        <tr>
          <th />
          <th
            v-for="(field, fieldSlug) in fieldsWithoutId"
            :key="'title-' + fieldSlug"
          >
            {{ field.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="hit in hits"
          :key="'row-' + hit._id"
        >
          <td class="period">
            <b>{{ hit.title }}</b>
          </td>
          <td
            v-for="field in hit.fields"
            :key="'value-' + hit._id + '-' + field.slug"
          >
            {{ field.value !== null ? field.value : 'N/A' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    },
    query: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    results: {
      type: Object,
      required: true
    }
  },

  computed: {
    fieldsWithoutId () {
      const fields = { ...this.fields }
      delete fields._id
      return fields
    },
    hits () {
      return this.results.hits.map(hit => {
        const aggregatedFields = {}
        for (const fieldSlug of Object.keys(this.fieldsWithoutId)) {
          const field = this.fields[fieldSlug]
          const format = field.format || (v => v)
          aggregatedFields[fieldSlug] = {
            slug: fieldSlug,
            name: field.name,
            value: format(hit[fieldSlug])
          }
        }
        return {
          _id: hit._id,
          title: this.fields._id.format(hit._id),
          fields: aggregatedFields
        }
      })
    }
  }
}
</script>

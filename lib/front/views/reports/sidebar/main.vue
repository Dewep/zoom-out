<template>
  <nav>
    <SidebarSitename />

    <SidebarHeader />

    <SidebarMenu />

    <SidebarFooter />
  </nav>
</template>

<script>
import SidebarSitename from '@/views/reports/sidebar/sitename.vue'
import SidebarHeader from '@/views/reports/sidebar/header.vue'
import SidebarMenu from '@/views/reports/sidebar/menu.vue'
import SidebarFooter from '@/views/reports/sidebar/footer.vue'

export default {
  components: {
    SidebarSitename,
    SidebarHeader,
    SidebarMenu,
    SidebarFooter
  }
}
</script>

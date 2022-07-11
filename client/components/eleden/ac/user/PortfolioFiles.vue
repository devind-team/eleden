<template lang="pug">
v-data-table(
  :headers="headers"
  :items="items"
  :loading="loading"
  show-expand dense
  disable-pagination
  hide-default-footer
)
  template(#item.file.user.avatar="{ item }")
    avatar-dialog(:item="item.file.user")
  template(#item.file.user.name="{ item }")
    user-link(:user="item.file.user" full)
  template(#item.discipline="{ item }")
    span(v-if="item.discipline") {{ item.discipline.code }} {{ item.discipline.name }}
    v-icon(v-else) mdi-minus
  template(#expanded-item="{ item }")
    td(:colspan="headers.length + 1" style="padding: 6px 0px")
      v-data-table(
        :headers="subHeaders"
        :items="getSubItem(item)"
        hide-default-header
        disable-pagination
        hide-default-footer
        dense
      )
        template(#item.key="{ value }") {{ $t(`ac.users.portfolio.subTableKeys.${value}`) }}
        template(#item.value="{ item: subItem }")
          apollo-mutation(
            v-if="subItem.key === 'user'"
            v-slot="{ mutate, loading }"
            :mutation="require('~/gql/eleden/mutations/portfolio/confirm_portfolio_file.graphql')"
            :variables="{ portfolioFileId: item.id }"
          )
            confirmed-by-user(:loading="loading" :user="item.user" :can-change="canChange" @confirm="mutate")
          template(v-else-if="['createdAt', 'updatedAt'].includes(subItem.key)")
            | {{ dateTimeHM(subItem.value) }}
          template(v-else-if="subItem.key === 'file'")
            v-btn(
              :href="`/${item.file.src}`"
              target="_blank"
              color="primary"
              text
            ) {{ $t('ac.users.portfolio.buttons.open') }}
          template(v-else-if="subItem.key === 'delete'")
            apollo-mutation(
              v-slot="{ mutate, loading }"
              :mutation="require('~/gql/eleden/mutations/portfolio/delete_portfolio_file.graphql')"
              :variables="{ portfolioFileId: item.id }"
              :update="(store, result) => deleteUpdate(store, result, item)"
            )
              delete-menu(v-slot="{ on: onDelete }" @confirm="mutate")
                v-btn(
                  v-on="onDelete"
                  :loading="loading"
                  color="error"
                  text
                ) {{ $t('ac.users.portfolio.buttons.delete') }}
          template(v-else) {{ subItem.value }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { DataTableHeader } from 'vuetify'
import { DataProxy } from 'apollo-cache'
import { PortfolioFileType, UserType } from '~/types/graphql'
import { useI18n, useFilters } from '~/composables'
import AvatarDialog from '~/components/users/AvatarDialog.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'
import ConfirmedByUser from '~/components/eleden/ac/user/ConfirmedByUser.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type DeleteUpdateType = (store: DataProxy, result: any, pf: PortfolioFileType) => void
type GetSubItemType = (item: PortfolioFileType) => { key: string, value: string | UserType }[]

export default defineComponent({
  components: { AvatarDialog, UserLink, ConfirmedByUser, DeleteMenu },
  props: {
    items: { type: Array as PropType<PortfolioFileType[]>, default: () => [] },
    headers: { type: Array as PropType<DataTableHeader[]>, required: true },
    canChange: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    deleteUpdate: { type: Function as PropType<DeleteUpdateType>, required: true },
    getSubItem: { type: Function as PropType<GetSubItemType>, required: true }
  },
  setup () {
    const { t } = useI18n()
    const { dateTimeHM } = useFilters()

    const subHeaders = computed<DataTableHeader[]>(() => ([
      { text: t('ac.users.portfolio.tableSubheaders.key') as string, value: 'key' },
      { text: t('ac.users.portfolio.tableSubheaders.value') as string, value: 'value' }
    ]))

    return { dateTimeHM, subHeaders }
  }
})
</script>

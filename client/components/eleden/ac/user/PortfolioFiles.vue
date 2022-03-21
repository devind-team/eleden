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
          template(#item.key="{ value }") {{ t(`subTableKeys.${value}`) }}
          template(#item.value="{ item: subItem }")
            apollo-mutation(
              v-if="subItem.key === 'user'"
              v-slot="{ mutate, loading }"
              :mutation="require('~/gql/eleden/mutations/portfolio/confirm_portfolio_file.graphql')"
              :variables="{ portfolioFileId: item.id }"
            )
              confirmed-by-user(:loading="loading" :user="item.user" :can-change="canChange" @confirm="mutate")
            template(v-else-if="['createdAt', 'updatedAt'].includes(subItem.key)")
              | {{ $filters.dateTimeHM(subItem.value) }}
            template(v-else-if="subItem.key === 'file'")
              v-btn(:href="`/${item.file.src}`" target="_blank" color="primary" text) {{ t('buttons.open') }}
            template(v-else-if="subItem.key === 'delete'")
              apollo-mutation(
                v-slot="{ mutate, loading }"
                :mutation="require('~/gql/eleden/mutations/portfolio/delete_portfolio_file.graphql')"
                :variables="{ portfolioFileId: item.id }"
                :update="(store, result) => deleteUpdate(store, result, item)"
              )
                delete-menu(v-slot="{ on: onDelete }" @confirm="mutate")
                  v-btn(v-on="onDelete" :loading="loading" color="error" text) {{ t('buttons.delete') }}
            template(v-else) {{ subItem.value }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { PropType } from 'vue'
import { DataTableHeader } from 'vuetify'
import { DataProxy } from 'apollo-cache'
import { PortfolioFileType, UserType } from '~/types/graphql'
import AvatarDialog from '~/components/users/AvatarDialog.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'
import ConfirmedByUser from '~/components/eleden/ac/user/ConfirmedByUser.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type DeleteUpdate = (store: DataProxy, result: any, pf: PortfolioFileType) => void
type GetSubItem = (item: PortfolioFileType) => { key: string, value: string | UserType }[]

@Component<PortfolioFiles>({
  components: { AvatarDialog, UserLink, ConfirmedByUser, DeleteMenu },
  computed: {
    subHeaders (): DataTableHeader[] {
      return [
        { text: this.t('tableSubheaders.key') as string, value: 'key' },
        { text: this.t('tableSubheaders.value') as string, value: 'value' }
      ]
    }
  }
})
export default class PortfolioFiles extends Vue {
  @Prop({ type: Array as PropType<PortfolioFileType[]>, default: () => [] }) readonly items!: PortfolioFileType[]
  @Prop({ type: Array as PropType<DataTableHeader[]>, required: true }) readonly headers!: DataTableHeader[]
  @Prop({ type: Boolean, default: false }) readonly canChange!: boolean
  @Prop({ type: Boolean, default: false }) readonly loading!: boolean
  @Prop({ type: Function as PropType<DeleteUpdate>, required: true }) readonly deleteUpdate!: DeleteUpdate
  @Prop({ type: Function as PropType<GetSubItem>, required: true }) readonly getSubItem!: GetSubItem

  readonly user!: UserType
  readonly hasPerm!: (perm: string | string[]) => boolean
  readonly subHeaders!: DataTableHeader[]

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.users.portfolio.${path}`, values) as string
  }
}
</script>

<template>
  <v-container grid-list-xl fluid class="custom-manage-projects-container">
    <snackbar ref="snackbar"></snackbar>
    <v-layout>
      <v-flex md12>
        <h1 class="projects-header">Admin &mdash; Revenue Rates</h1>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex sm6 offset-sm6>
        <v-text-field
          class="search-bar"
          v-model="search"
          append-icon="search"
          label="Search User"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="users"
          hide-actions
          class="elevation-0 tm-v-datatable"
        >
          <template v-slot:items="props">
            <td>{{ props.item.contact.fullName }}</td>
            <td>
              <v-edit-dialog
                :return-value.sync="props.item.contact.revenueRate"
                lazy
                @save="save(props.item.contact)"
                @cancel="cancel"
                @open="open"
                @close="close"
              >
                {{
                  props.item.contact.revenueRate
                    ? `$${props.item.contact.revenueRate}/hr`
                    : "n/a - click to set"
                }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.contact.revenueRate"
                    label="Rate"
                    single-line
                    type="number"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
          </template>
        </v-data-table>
        <!-- </v-layout> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Snackbar from '../common/Snackbar.vue';

export default {
  name: 'admin-revenue-rates',
  components: {
    Snackbar,
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'contact.fullName' },
        { text: 'Rate', value: 'contact.revenueRate' },
      ],
      search: '',
    };
  },
  computed: {
    users() {
      if (this.search) {
        return this.$store.state.users.filter(item => item.contact.fullName.toLowerCase().includes(this.search.toLowerCase()));
      }
      return this.$store.state.users;
    },
  },
  methods: {
    fetchData() {
      this.$store.dispatch('fetchUsers');
    },
    async save(contact) {
      let revenueRate = parseInt(contact.revenueRate, 10);
      revenueRate = !isNaN(revenueRate) ? revenueRate : null;
      await this.$store.dispatch('updateContactPartial', {
        id: contact.id,
        revenueRate,
      });
      this.$refs.snackbar.displaySnackbar('success', 'Data saved');
    },
    cancel() {
      this.$refs.snackbar.displaySnackbar('info', 'Cancelled');
    },
    open() {},
    close() {},
  },
  created() {
    this.fetchData();
  },
};
</script>

<template>
  <v-container grid-list-xl fluid class="custom-manage-projects-container">
    <snackbar ref="snackbar"></snackbar>
    <v-layout>
      <v-flex md12>
        <h1 class="projects-header">Admin &mdash; Hourly Rates</h1>
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
            <td style="width:30%">{{ props.item.contact.fullName }}</td>
            <td style="width:30%">
              <v-edit-dialog
                :return-value.sync="props.item.contact.hourlyRate"
                lazy
                @save="save(props.item.contact)"
                @cancel="cancel"
                @open="open"
                @close="close"
              >
                {{
                  props.item.contact.hourlyRate
                    ? `$${props.item.contact.hourlyRate}/hr`
                    : "n/a - click to set"
                }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.contact.hourlyRate"
                    label="Rate"
                    single-line
                    type="number"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td v-if="props.item.contact.financeCodes">
              <v-select
                :items="allFinanceCodes"
                v-model="props.item.contact.financeCodes.id"
                item-value="id"
                @change="saveFinanceCode(props.item.contact, props.item.contact.financeCodes.id)"
                item-text="financeName"
              ></v-select>
            </td>
            <td v-else>
              <v-select
                v-model="props.item.contact.financeCodes"
                :items="allFinanceCodes"
                item-value="id"
                @change="saveFinanceCode(props.item.contact, props.item.contact.financeCodes)"
                item-text="financeName"
              ></v-select>
            </td>

            <!-- <td v-if="props.item.contact.financeCodes">

              <v-edit-dialog
                :return-value.sync="props.item.contact.financeCodes.id"
                lazy
                @save="saveFinanceCode(props.item.contact)"
                @cancel="cancel"
                @open="open"
                @close="close"
              >

               {{ props.item.contact.financeCodes.financeName }}


                <template v-slot:input>


                   <v-select
            :items="allFinanceCodes"

            label="Finance Code"

            v-model="props.item.contact.financeCodes.id"
            item-value="id"
            item-text="financeName"
          ></v-select>


                </template>
              </v-edit-dialog>
            </td>

            <td v-else>n/a - click to set</td> -->
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
  name: 'admin-hourly-rates',
  components: {
    Snackbar,
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'contact.fullName' },
        { text: 'Rate', value: 'contact.hourlyRate' },
        { text: 'Finance Code', value: 'contact.financeCodes.Id' },
      ],
      search: '',
    };
  },
  computed: {
    allFinanceCodes() {
      return this.$store.state.allFinanceCodes;
    },

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
      this.$store.dispatch('fetchAllFinanceCodes');
    },

    async saveFinanceCode(contact, financeId) {
      await this.$store.dispatch('updateContactPartial', {
        id: contact.id,
        financeCodes: financeId,
      });
      this.$store.dispatch('fetchAllFinanceCodes');
      this.$refs.snackbar.displaySnackbar('success', 'Data saved');
    },
    async save(contact) {
      let hourlyRate = parseInt(contact.hourlyRate, 10);
      hourlyRate = !isNaN(hourlyRate) ? hourlyRate : null;
      await this.$store.dispatch('updateContactPartial', {
        id: contact.id,
        hourlyRate,
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

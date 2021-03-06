<template>
  <v-card>
    <spinner ref="spinner"></spinner>
    <snackbar ref="snackbar"></snackbar>
    <confirm ref="confirm"></confirm>
    <v-toolbar v-if="title" card dense color="transparent">
      <v-toolbar-title>
        <h4>{{ title }}</h4>
      </v-toolbar-title>
    </v-toolbar>
    <v-container fluid>
      <v-radio-group v-model="isResolved" row>
        <v-radio label="Logs In Progress" :value="false" isResolved></v-radio>
        <v-radio label="Resolved Logs" :value="true" isResolved></v-radio>
      </v-radio-group>
    </v-container>
    <v-divider></v-divider>

    <v-card-text class="pa-0">
      <template>
        <v-data-table
          :headers="headers"
          :items="allProcLogs"
          hide-actions
          class="elevation-0 tm-v-datatable"
          disable-initial-sort
          aria-multiline="true"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td>
              <procurement-log ref="ProcurementLog"></procurement-log>
              <span class="clickable" @click="viewRequest(props.item.id)">{{
                props.item.logType
              }}</span>
            </td>
            <!-- <td class="text-xs-left">{{ props.item.riskOwner }}</td> -->
            <td class="text-xs-left">
              <procurement-log ref="ProcurementLog"></procurement-log>
              <span class="clickable" @click="viewRequest(props.item.id)"
                >{{ props.item.descriptionOfIssue.toString().slice(0, 30) + "..." }}
              </span>
            </td>
            <td class="text-xs-left">{{ props.item.dateToClient | formatDate }}</td>
            <td class="text-xs-left">{{ props.item.notificationMethod }}</td>
            <td class="text-xs-left">{{ props.item.riskOwner }}</td>
            <td class="text-xs-left">{{ props.item.phaseImpactName }}</td>
            <td class="text-xs-left">{{ props.item.clientDecision }}</td>
            <td class="text-xs-left">
              {{
                props.item.followUpDate
                  ? new Date(props.item.followUpDate).toString().slice(3, 15)
                  : ""
              }}
            </td>
            <td width="10%" class="text-xs-left">
              <!-- <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <procurement-log ref="ProcurementLog"></procurement-log>
                  <v-btn flat icon color="grey" v-on="on" @click="viewRequest(props.item.id)">
                    <v-icon>visibility</v-icon>
                  </v-btn>
                </template>
                <span>View Procurement Log</span>
              </v-tooltip> -->
              <v-btn
                small
                v-if="!isResolved"
                color="btnPrimary"
                class="white--text intake-table-approve-btn ma-0"
                @click="resolveLog(props.item.id)"
                >RESOLVE</v-btn
              >
            </td>
          </template>
        </v-data-table>
      </template>
      <v-divider></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
import Spinner from '../common/Spinner.vue';
import ProcurementLog from './Procurementlog.vue';
import Confirm from '../common/Confirm.vue';
import Snackbar from '../common/Snackbar.vue';

export default {
  props: {
    title: String,
    search: String,
  },
  components: {
    Snackbar,
    Spinner,
    Confirm,
    ProcurementLog,
  },
  data() {
    return {
      isResolved: false,

      logList: this.fetchData(),
      selectedLeadUser: '',
      selectedProjectBackup: '',
      unResolved: [],
    };
  },
  computed: {
    headers() {
      const headers = [
        {
          text: 'Log Type',
          value: 'logType',
          align: 'left',
          sortable: false,
          width: '10%',
        },
        // { text: 'Risk Owner', value: 'riskOwner', sortable: false },
        {
          text: 'Description of Issue',
          value: 'issueDescription',
          sortable: false,
          width: '20%',
        },
        {
          text: 'Date To Client',
          value: 'dateToClient',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Method of Notification',
          value: 'notificationMethod',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Decision Maker',
          value: 'riskOwner',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Phase Impact',
          value: 'phaseImpactName',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Client Decision',
          value: 'clientDecision',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Resolution or Follow Up Date',
          value: 'followUpDate',
          sortable: false,
          width: '12%',
        },
      ];

      if (!this.isResolved) {
        headers[1].width = '15%';
        headers[7].width = '12%';

        headers.push({ text: 'Action', width: '15%' });
      }
      return headers;
    },
    allProcLogs() {
      if (this.isResolved) {
        const value = this.$store.state.allProcurementLog.filter(el => el.isResolved == true);
        return value;
      }
      const value = this.$store.state.allProcurementLog.filter(el => el.isResolved == false);
      return value;
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async resolveLog(id) {
      if (await this.$refs.confirm.open('info', 'Are you sure you want to resolve this log?')) {
        const found = this.$store.state.allProcurementLog.find(element => element.id == id);
        found.isResolved = true;
        await this.$store
          .dispatch('updateProctLog', {
            procurementlog: found,
          })
          .then(
            () => {
              this.$refs.snackbar.displaySnackbar('success', 'Resolved');
            },
            (err) => {
              try {
                const { message } = err.response.data.error;
                this.$refs.snackbar.displaySnackbar('error', message);
              } catch (ex) {
                this.$refs.snackbar.displaySnackbar('error', 'Failed to Resolve');
              }
            },
          );
      }
    },
    async close() {
      this.fetchData();
    },

    viewRequest(procId) {
      const found = this.$store.state.allProcurementLog.find(element => element.id == procId);
      this.$refs.ProcurementLog.reset();
      this.$refs.ProcurementLog.openWithValues(found);
    },
    async fetchData() {
      if (this.$refs.spinner) {
        this.$refs.spinner.open();
      }
      const { params } = this.$router.currentRoute;
      const id = params.id || undefined;
      const procLogs = await this.$store.dispatch('fetchAllProcurementLog', {
        id,
      });
      const projRfxData = await this.$store.dispatch('fetchProjectRFxData', {
        id,
      });
      if (this.$refs.spinner) this.$refs.spinner.close();
      return procLogs[0];
    },
  },
};
</script>
<style scoped>
.v-input--radio-group--row .v-radio {
  display: flex;
}
.v-data-table {
  word-break: initial;
}

.pa-0 >>> .tm-v-datatable thead th:nth-child(7),
.pa-0 >>> .tm-v-datatable thead th:nth-child(8),
.pa-0 >>> .tm-v-datatable thead th:nth-child(2),
.pa-0 >>> .tm-v-datatable thead th:nth-child(6),
.pa-0 >>> .tm-v-datatable thead th:nth-child(5),
.pa-0 >>> .tm-v-datatable thead th:nth-child(4),
.pa-0 >>> .tm-v-datatable thead th:nth-child(3) {
  font-size: 14px !important;
  font-weight: 700 !important;
  word-break: break-word;
  white-space: inherit !important;
}
</style>

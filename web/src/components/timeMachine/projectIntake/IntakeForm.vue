<template>
  <div class="intake-form">
    <snackbar ref="snackbar"></snackbar>
    <spinner ref="spinner"></spinner>
    <v-form>
      <v-layout>
        <v-flex md12 class="intake-form-header-div">
          <h1 class="intake-form-header">Intake Form</h1>
          <div class="intake-sub-header">Complete the intake form to submit your project</div>
        </v-flex>
      </v-layout>
      <v-container>
        <v-stepper v-model="e1" alt-labels>
          <v-stepper-header>
            <v-stepper-step
              @click="checkedit(1)"
              :editable="isEditPInnfo"
              edit-icon="1"
              :complete="e1 > 1"
              :step="1"
              :class="editall ? 'stepper-color' : ''"
            >
              Procurement Project
              <br />Information
            </v-stepper-step>
            <v-divider class="first-divider"></v-divider>
            <v-divider class="second-divider"></v-divider>
            <v-stepper-step
              @click="checkedit(2)"
              :editable="isEditMBInfo"
              edit-icon="2"
              :complete="e1 > 2"
              :step="2"
              :class="editall ? 'stepper-color' : ''"
              >Ministry/Branch Information</v-stepper-step
            >
            <v-divider class="first-divider"></v-divider>
            <v-divider class="second-divider"></v-divider>
            <v-stepper-step
              @click="checkedit(3)"
              :editable="isEditRiskInfo"
              edit-icon="3"
              :complete="e1 > 3"
              :step="3"
              :class="editall ? 'stepper-color' : ''"
            >
              Risk
              <br />Assessment
            </v-stepper-step>
            <v-divider class="first-divider"></v-divider>
            <v-divider class="second-divider"></v-divider>
            <v-stepper-step
              @click="checkedit(4)"
              :editable="isEditContactInfo"
              edit-icon="4"
              :complete="e1 > 4"
              :step="4"
              :class="editall ? 'stepper-color' : ''"
            >
              Contact
              <br />Information
            </v-stepper-step>
            <v-divider class="first-divider"></v-divider>
            <v-divider class="second-divider"></v-divider>
            <v-stepper-step
              @click="checkedit(5)"
              :editable="isEditContactInfo"
              edit-icon="5"
              :complete="e1 > 4"
              step="5"
              :class="editall ? 'stepper-color' : ''"
            >
              Review
              <br />& Submit
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <template v-slot:header>
                <div class="primary-heading">
                  <img src="../../../images/projectinfo.svg" />
                  <label class="sub-header-large">Project Information</label>
                </div>
              </template>
              <v-card>
                <v-card-text>
                  <intake-base-info
                    ref="intakeBaseInfo"
                    :project="intakeRequest"
                    @next="nextButtonClick(2)"
                  ></intake-base-info>
                </v-card-text>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="2">
              <template v-slot:header>
                <div class="primary-heading">
                  <img src="../../../images/ministryinfo.svg" />
                  <label class="sub-header-large">Ministry / Branch Information</label>
                </div>
              </template>
              <v-btn @click="backfn(1)" flat large color="primary" class="back-link"
                >&lt; Project Information</v-btn
              >
              <v-card>
                <v-card-text>
                  <!-- Only one client on the form for now, but there will be multiple in the future -->
                  <ministry-branch-info
                    ref="intakeClientInfo"
                    :ministry="intakeRequest.client"
                    @next="nextButtonClick(3)"
                  ></ministry-branch-info>
                </v-card-text>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="3">
              <template v-slot:header>
                <div class="primary-heading">
                  <img src="../../../images/ministryinfo.svg" />
                  <label class="sub-header-large">Risk Assessment</label>
                </div>
              </template>
              <v-btn @click="backfn(2)" flat large color="primary" class="back-link"
                >&lt; Ministry / Branch Information</v-btn
              >
              <v-card>
                <v-card-text>
                  <!-- Only one client on the form for now, but there will be multiple in the future -->
                  <intake-risk-assessment
                    ref="intakeRiskAssessment"
                    :intakeRisk="intakeRiskQuestions"
                    @next="nextButtonClick(4)"
                  ></intake-risk-assessment>
                </v-card-text>
              </v-card>
            </v-stepper-content>
            <v-stepper-content step="4">
              <template v-slot:header>
                <div class="primary-heading">
                  <img src="../../../images/contactinfo.svg" />
                  <label class="sub-header-large">Contact Information</label>
                </div>
              </template>
              <v-btn @click="backfn(3)" flat large color="primary" class="back-link"
                >&lt; Risk Assessment</v-btn
              >
              <div class="intake-contact-layout">
                <v-flex md12 class="intake-base-info-header">
                  <span class="intake-base-info-header-content">Contact Information</span>
                </v-flex>
                <v-card>
                  <v-card-text>
                    <div>
                      <v-layout row wrap>
                        <v-flex xs12 md6 my-3>
                          <h3 class="v-form-container">Client Lead Contact Information</h3>
                          <project-contact-info
                            ref="projectLead"
                            :contact="getClientInfo(CLIENT_LEAD)"
                            :contactNameLabel="'Client Lead Name'"
                            :isRequired="true"
                            @next="nextButtonClick(5)"
                          />
                        </v-flex>
                        <v-flex xs12 md6 my-3>
                          <h3 class="v-form-container">Executive Sponsor Contact Information</h3>
                          <project-contact-info
                            ref="projectSponsor"
                            :contact="getClientInfo(CLIENT_SPONSOR)"
                            :contactNameLabel="'Executive Sponsor Name'"
                            :isRequired="true"
                            @next="nextButtonClick(5)"
                          />
                        </v-flex>
                        <v-flex xs12 md6 my-3>
                          <h3 class="v-form-container">Financial Contact Information</h3>
                          <project-contact-info
                            ref="projectFinance"
                            :contact="getClientInfo(CLIENT_FINANCE)"
                            :contactNameLabel="'Financial Contact Name'"
                            @next="nextButtonClick(5)"
                          />
                        </v-flex>
                        <v-flex
                          xs12
                          md6
                          my-3
                          v-for="(addcontact, index) in contactData"
                          :key="index"
                          :value="0"
                        >
                          <template v-slot:header>
                            <div class="primary-heading">
                              <!-- <img src="@/assets/bulb.svg"> -->
                              <v-flex xs11></v-flex>
                            </div>
                          </template>
                          <v-card>
                            <v-card-text>
                              <h3 class="v-form-container">Additional Contact Information</h3>
                              <project-additional-contact-info
                                :additionalContact="addcontact"
                                ref="additionalcontactinfo"
                                :contact="getClientInfo(CLIENT_CONTACT)"
                                :contactNameLabel="'Contact Name'"
                                :isRequired="false"
                                @next="nextButtonClick(5)"
                              />
                            </v-card-text>
                          </v-card>
                        </v-flex>

                        <!-- <div>
                              <v-checkbox
                                color="primary"
                                v-model="enabled"
                                class="v-form-container"
                              >
                                <template v-slot:label>
                                  <h3>Additional Contact</h3>
                                </template>
                              </v-checkbox>
                        </div>-->
                      </v-layout>
                      <v-card>
                        <v-flex xs12>
                          <div class="contact-button-div">
                            <v-btn color="primary" @click="addNewContact">
                              <v-icon left dark>add</v-icon>Add Contact
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-card>
                      <v-layout>
                        <v-flex xs12>
                          <div class="v-form-container">
                            <div class="v-form-actions">
                              <v-flex md-12 mt-4>
                                <v-btn
                                  :disabled="
                                    !(
                                      $store.state.projectInformation &&
                                      $store.state.ministryInformation &&
                                      this.$store.state.intakeRiskQuestions
                                    )
                                  "
                                  color="primary"
                                  @click="nextButtonClick(5)"
                                  >Next</v-btn
                                >
                              </v-flex>
                            </div>
                          </div>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-stepper-content>
            <v-stepper-content step="5">
              <v-btn @click="backfn(4)" flat large color="primary" class="back-link"
                >&lt; Contact Information</v-btn
              >
              <v-card class="mb-12" color="grey lighten-1" height="200px">
                <intake-review
                  ref="intakeReview"
                  :intakeValues="reviewSubmit"
                  @switch="moveToComponent"
                ></intake-review>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <v-flex xs12 py-2>
          <div class="v-form-container">
            <div class="v-form-actions">
              <v-flex md12 mt-4 v-if="e1 == 5">
                <v-btn color="default" @click="discard">Discard</v-btn>
                <v-btn
                  :disabled="
                    !(
                      $store.state.projectInformation &&
                      $store.state.ministryInformation &&
                      $store.state.contactInformation
                    )
                  "
                  color="primary"
                  @click="submitForm"
                  >Submit</v-btn
                >
              </v-flex>
            </div>
          </div>
        </v-flex>
      </v-container>
    </v-form>
  </div>
</template>
<script>
import assign from 'object-assign';
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import AdditionalContact from '@/domain/models/AdditionalContact.dto';
// import { setTimeout } from 'timers';
import IntakeBaseInfo from './IntakeBaseInfo.vue';
import MinistryBranchInfo from '../common/MinistryBranchInfo.vue';
import Snackbar from '../common/Snackbar.vue';
import Spinner from '../common/Spinner.vue';
import ProjectContactInfo from '../projects/ProjectContactInfo.vue';
import intakeRiskAssessment from './intakeRisk.vue';
import ProjectAdditionalContactInfo from '../projects/ProjectAddintionalContactInfo.vue';
import intakeReview from './IntakeReviewSubmit.vue';
import './intakeform.styl';

Vue.use(VeeValidate);

const INTAKE_FORM_PANELS = {
  PROJECT_INFO: 'projectInfo',
  CLIENTS_INFO: 'clientInfo',
  CONTACTS_INFO: 'contactInfo',
  RISK_ASSESSMENT: 'intakeRisk',
};

const CLIENT_INFO_TYPES = {
  CLIENT_LEAD: 'clientlead',
  CLIENT_SPONSOR: 'clientsponsor',
  CLIENT_CONTACT: 'clientcontact',
  CLIENT_FINANCE: 'clientfinance',
};

export default {
  components: {
    IntakeBaseInfo,
    MinistryBranchInfo,
    ProjectContactInfo,
    ProjectAdditionalContactInfo,
    intakeRiskAssessment,
    intakeReview,
    Snackbar,
    Spinner,
  },
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      additionalContact: [new AdditionalContact()],
      projectInformation: this.$store.state.projectInformation,
      ministryInformation: this.$store.state.ministryInformation,
      contactInformation: this.$store.state.contactInformation,
      intakeRiskQuestions: this.$store.state.intakeRiskQuestions,
      editall: false,
      valid: false,
      enabled: false,
      isEditPInnfo: false,
      isEditMBInfo: false,
      isEditContactInfo: false,
      isEditRiskInfo: false,
      ...INTAKE_FORM_PANELS,
      ...CLIENT_INFO_TYPES,
      e1: 1,
      reviewSubmit: [],
      allContacts: [],
      contactCount: 0,
      contactData: [],
    };
  },
  computed: {
    intakeRequest() {
      return this.$store.state.activeIntakeRequest;
    },
    // contactData() {
    //   return this.$store.state.activeProjectRfxData;
    // }
  },
  methods: {
    addNewContact() {
      this.contactCount = this.contactCount + 1;
      this.contactData.push(new AdditionalContact());
    },
    moveToComponent(item) {
      // this.e1 = item;
      this.checkedit(item, true);
    },
    checkedit(msg, flag = false) {
      if (!flag && this.e1 < msg && !this.editall) {
        msg = this.e1;
      }
      if (!this.editall) {
        if (msg === 1 || msg === '1') {
          this.e1 = 1;
          this.isEditMBInfo = false;
          this.isEditContactInfo = false;
          this.isEditRiskInfo = false;
        } else if (msg === 2 || msg === '2') {
          this.e1 = 2;
          this.isEditPInnfo = true;
          this.isEditMBInfo = false;
          this.isEditContactInfo = false;
          this.isEditRiskInfo = false;
        } else if (msg === 3 || msg === '3') {
          this.e1 = 3;
          this.isEditPInnfo = true;
          this.isEditMBInfo = true;
          this.isEditContactInfo = false;
          this.isEditRiskInfo = false;
        } else if (msg === 4 || msg === '4') {
          this.e1 = 4;
          this.isEditPInnfo = true;
          this.isEditMBInfo = true;
          this.isEditRiskInfo = true;
        } else {
          this.e1 = 5;
          //   this.isEditPInnfo = false;
          // this.isEditMBInfo = false;
          // this.isEditContactInfo = false;
          // this.isEditRiskInfo = false;
        }
      } else {
        this.isEditMBInfo = true;
        this.isEditPInnfo = true;
        this.isEditRiskInfo = true;
        this.isEditContactInfo = true;
      }
      if (flag) {
        this.e1 = msg;
      }
    },
    fetchData() {
      const { params } = this.$router.currentRoute;
      const id = params.id || undefined;
      if (!(id === undefined)) {
        this.$store.dispatch('fetchIntakeRequest', { id: params.id });
      } else {
        this.$store.dispatch('clearActiveIntakeRequest');
      }
    },
    getRiskAnalysis() {
      const riskAnalysis = [];
      let riskAnalysisIndex = 0;
      let applicableQuestion = false;
      let scoreValue = 0;
      let selectedanswerTxt = '';
      for (let i = 0; i < this.$store.state.intakeRiskQuestions.length; i++) {
        scoreValue = 0;
        selectedanswerTxt = '';
        const question = this.$store.state.intakeRiskQuestions[i];
        if (typeof question.selectedAnswerId !== 'undefined' || question.selectedAnswerId) {
          const selectedAnswer = question.answer.filter(
            answer => answer.id === question.selectedAnswerId,
          );
          if (selectedAnswer && selectedAnswer[0]) {
            scoreValue = selectedAnswer[0].score;
            selectedanswerTxt = selectedAnswer[0].answer;
          }
          if (question.questionNo === 1) {
            applicableQuestion = question.showStatus;
            riskAnalysis[riskAnalysisIndex] = {
              questionId: question.id,
              answerId: question.selectedAnswerId,
              score: scoreValue,
              question: question.question,
              answer: selectedanswerTxt,
            };
            riskAnalysisIndex++;
          } else if (applicableQuestion) {
            riskAnalysis[riskAnalysisIndex] = {
              questionId: question.id,
              answerId: question.selectedAnswerId,
              score: scoreValue,
              question: question.question,
              answer: selectedanswerTxt,
            };
            riskAnalysisIndex++;
          }
        }
      }
      return riskAnalysis;
    },
    async submitForm() {
      this.$refs.projectLead.onNextClicked();
      this.$refs.projectSponsor.onNextClicked();
      this.$refs.projectFinance.onNextClicked();

      const riskAnalysis = this.getRiskAnalysis();

      const riskResult = this.$refs.intakeRiskAssessment.calculateRiskScore();
      let riskLevel = 0;
      if (riskResult.level === 'High') {
        riskLevel = 1;
      } else if (riskResult.level === 'Medium') {
        riskLevel = 2;
      } else if (riskResult.level === 'Low') {
        riskLevel = 3;
      }

      const formData = assign({}, this.$refs.intakeBaseInfo.form, {
        client: this.$refs.intakeClientInfo.form,
        contacts: [],
        risk: riskAnalysis,
        IntakeriskScore: riskResult.percentage,
        riskScore: riskResult.percentage,
        psbRiskScore: 0,
        isSPOEngagement: false,
        intakeRiskLevel: riskLevel,
      });
      this.$refs.intakeClientInfo.form.intakeRiskLevel = riskResult.level;
      const projectLead = this.$refs.projectLead.form || undefined;
      const projectSponsor = this.$refs.projectSponsor.form || undefined;
      const projectFinance = this.$refs.projectFinance.form || undefined;
      let projectContact;
      if (this.enabled) {
        projectContact = this.$refs.projectContact.form || undefined;
      }
      // Set types - this could be done dynamically later, but definitely out of scope
      // and doing so wouldn't match the user interface that has been approved
      if (projectLead !== undefined) {
        projectLead.contactType = CLIENT_INFO_TYPES.CLIENT_LEAD;
      }

      if (projectSponsor !== undefined) {
        projectSponsor.contactType = CLIENT_INFO_TYPES.CLIENT_SPONSOR;
      }
      if (projectFinance !== undefined) {
        projectFinance.contactType = CLIENT_INFO_TYPES.CLIENT_FINANCE;
      }
      if (projectContact !== undefined) {
        projectContact.contactType = CLIENT_INFO_TYPES.CLIENT_CONTACT;
      }

      let contacts = [projectLead, projectSponsor, projectFinance, projectContact].filter(
        contact => contact !== undefined,
      );

      const proContacts = [];
      for (let i = 0; i < this.allContacts.length; i++) {
        if (this.allContacts[i].email != '') {
          proContacts.push(this.allContacts[i]);
        }
      }
      contacts = contacts.concat(proContacts);
      if (contacts instanceof Array && contacts.length > 0) {
        if (formData.contacts instanceof Array) {
          formData.contacts = formData.contacts.concat(contacts);
        }
      }
      this.contacts = [];
      this.contactData = [];
      if (
        this.$store.state.projectInformation
        && this.$store.state.ministryInformation
        && this.$store.state.contactInformation
        && this.$store.state.intakeRisk
      ) {
        this.$refs.spinner.open();
        formData.estimatedContractValue = formData.estimatedContractValue;
        this.$store.dispatch('addIntakeRequest', formData).then(
          () => {
            this.$refs.snackbar.displaySnackbar('success', 'Project Intake Form Submited.');
            this.$refs.spinner.close();
            this.$router.push('intake-success');
          },
          (err) => {
            this.$refs.spinner.close();
            if (err && err.response && err.response.data) {
              const { message } = err.response.data.error;
              this.$refs.snackbar.displaySnackbar('error', message);
            } else {
              this.$refs.snackbar.displaySnackbar('error', 'Intake Request Error');
            }
          },
        );
      }
    },
    discard() {
      this.$refs.intakeBaseInfo.reset();
      this.$refs.intakeClientInfo.reset();
      this.$refs.projectLead.reset();
      this.$refs.projectSponsor.reset();
      this.$refs.projectFinance.reset();
      this.$refs.projectContact.reset();
      this.$refs.intakeRiskAssessment.reset();
    },
    getClientInfo(infoType) {
      const contacts = this.$store.state.activeIntakeRequest.contacts || [];
      const clientInfo = contacts.find(contact => contact.contactType === infoType);
      return clientInfo;
    },
    backfn(step) {
      if (step - 1 === 1) {
        this.isEditPInnfo = true;
        this.isEditRiskInfo = false;
        this.isEditContactInfo = false;
      } else if (step - 1 === 2) {
        this.isEditMBInfo = true;
        this.isEditPInnfo = true;
        this.isEditContactInfo = false;
      } else if (step - 1 === 3) {
        this.isEditMBInfo = true;
        this.isEditPInnfo = true;
        this.isEditRiskInfo = true;
      } else {
        this.isEditMBInfo = false;
        this.isEditPInnfo = false;
        this.isEditRiskInfo = false;
        this.isEditContactInfo = false;
      }
      this.e1 = step;

      // Scroll to top after navigating
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    nextButtonClick(step) {
      if (step === 5) {
        this.allContacts = [];
        for (let i = 0; i < this.contactCount; i++) {
          const res = `additionalcontactinfo${i.toString()}`;
          this.$refs.additionalcontactinfo[i].form.contactType = 'clientcontact';
          this.allContacts.push(this.$refs.additionalcontactinfo[i].form);
        }
        const value1 = this.$refs.projectLead.onNextClicked();
        const value2 = this.$refs.projectSponsor.onNextClicked();
        const value3 = this.$refs.projectFinance.onNextClicked();
        if (value1 && value2 && value3) {
          this.isEditMBInfo = true;
          this.isEditPInnfo = true;
          this.isEditRiskInfo = true;
          this.isEditContactInfo = true;
          this.editall = true;
          this.e1 = step;
        }
        const riskAnalysis = this.getRiskAnalysis();
        const mappedScores = riskAnalysis.map(o => o.score);
        let scoreSum = 0;
        if (mappedScores.length != 0) {
          scoreSum = mappedScores.reduce((a, c) => a + c);
        }
        const formData = assign({}, this.$refs.intakeBaseInfo.form, {
          client: this.$refs.intakeClientInfo.form,
          contacts: [],
          risk: riskAnalysis,
          riskScore: scoreSum,
        });
        const projectLead = this.$refs.projectLead.form || undefined;
        const projectSponsor = this.$refs.projectSponsor.form || undefined;
        const projectFinance = this.$refs.projectFinance.form || undefined;
        let projectContact;
        if (this.enabled) {
          projectContact = this.$refs.projectContact.form || undefined;
        }
        // Set types - this could be done dynamically later, but definitely out of scope
        // and doing so wouldn't match the user interface that has been approved
        if (projectLead !== undefined) {
          projectLead.contactType = CLIENT_INFO_TYPES.CLIENT_LEAD;
        }

        if (projectSponsor !== undefined) {
          projectSponsor.contactType = CLIENT_INFO_TYPES.CLIENT_SPONSOR;
        }
        if (projectFinance !== undefined) {
          projectFinance.contactType = CLIENT_INFO_TYPES.CLIENT_FINANCE;
        }
        if (projectContact !== undefined) {
          projectContact.contactType = CLIENT_INFO_TYPES.CLIENT_CONTACT;
        }

        let contacts = [projectLead, projectSponsor, projectFinance, projectContact].filter(
          contact => contact !== undefined,
        );
        contacts = contacts.concat(this.allContacts);
        if (contacts instanceof Array && contacts.length > 0) {
          if (formData.contacts instanceof Array) {
            formData.contacts = formData.contacts.concat(contacts);
          }
        }

        if (
          this.$store.state.projectInformation
          && this.$store.state.ministryInformation
          && this.$store.state.contactInformation
          // && this.$store.state.intakeRisk
        ) {
          // this.$refs.spinner.open();
          formData.estimatedContractValue = formData.estimatedContractValue;
          this.reviewSubmit = formData;
        }
      } else {
        if (step - 1 === 1) {
          this.isEditPInnfo = true;
          this.isEditRiskInfo = false;
          this.isEditContactInfo = false;
        } else if (step - 1 === 2) {
          this.isEditMBInfo = true;
          this.isEditPInnfo = true;
          this.isEditContactInfo = false;
        } else if (step - 1 === 3) {
          this.isEditMBInfo = true;
          this.isEditPInnfo = true;
          this.isEditRiskInfo = true;
        } else {
          this.isEditMBInfo = false;
          this.isEditPInnfo = false;
          this.isEditRiskInfo = false;
          this.isEditContactInfo = false;
        }
        this.e1 = step;
      }
      // Scroll to top of page after navigating
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style>
legend {
  margin-left: 1em;
}
.intake-contact-layout {
  width: 98%;
  margin-left: 1%;
  margin-bottom: 1%;
  border: solid 1px #eae8e8;
  border-radius: 6px;
  box-shadow: none !important;
}
.v-card__text {
  padding: 0px;
}
.contact-button-div {
  margin-left: 2%;
}
</style>

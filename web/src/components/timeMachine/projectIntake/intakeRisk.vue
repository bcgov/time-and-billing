<template>
  <v-layout class="risk-info-layout" row wrap py-2>
    <v-flex md12 class="intake-base-info-header"><span class="intake-base-info-header-content">Risk Assessment</span>
   </v-flex>
    <v-form id="intake-risk-assessment" ref="intakeRiskAssessment" style="margin-left:30px; margin-top:20px" v-model="valid" lazy-validation>
      <v-flex sm12 v-for="item in intakeRiskQuestion" :key="item.id">
        <v-flex sm12>
          <div v-if="item.questionNo == 1">
            <h2>{{ categoryList[item.category - 1].text }}</h2>
            <br />
          </div>
          <div v-if="categoryList[item.category - 1].showStatus || item.questionNo == 1">
            <div v-html="item.question" class="question" />
            <v-radio-group
              v-if="item.answer && item.answer[0] && item.answer[0].answer.length < 16"
              row
              v-model="item.selectedAnswerId"
            >
              <v-radio
                v-on:change="updateCategoryStatus(item, index)"
                class="answer"
                v-for="(selection, index) in item.answer"
                :key="selection.id"
                :label="selection.answer"
                :value="selection.id"
              ></v-radio>
            </v-radio-group>
            <v-radio-group
              v-if="item.answer && item.answer[0] && item.answer[0].answer.length > 15"
              v-model="item.selectedAnswerId"
              column
            >
              <v-radio
                class="answer"
                v-on:change="updateCategoryStatus(item, index)"
                v-for="(selection, index) in item.answer"
                :key="selection.id"
                :label="selection.answer"
                :value="selection.id"
              ></v-radio>
            </v-radio-group>
          </div>
        </v-flex>
      </v-flex>
      <v-flex xs12>
        <div class="v-form-container">
          <div class="v-form-actions">
            <v-flex md-12 mt-4>
              <v-btn :disabled="!valid" color="primary" @click="onNextClicked">Next</v-btn>
            </v-flex>
          </div>
        </div>
      </v-flex>
    </v-form>
  </v-layout>
</template>
<script>
import './intakeRisk.styl';

export default {
  components: {},
  props: {
    intakeRisk: Array,
    nextPanel: Function,
    panelName: String,
  },
  computed: {
    intakeRiskQuestion() {
      return this.$store.state.intakeRiskQuestions.filter(item => !(item.is_PSB));
    },
  },
  data() {
    const form = Object.assign({}, this.$props.intakeRisk);
    return {
      valid: true,
      categoryList: [
        { id: 1, text: 'SIZE & SCOPE', showStatus: false },
        { id: 2, text: 'PROCESS COMPLEXITY', showStatus: false },
        { id: 3, text: 'CAPACITY', showStatus: false },
        { id: 4, text: 'UNIQUE ATTRIBUTES', showStatus: false },
      ],
      // requireRadioButtondRule: [v => ((v || !v) && v != null) || 'This field required'],
      // Initialize using props
      form: { ...form },
      intakeRiskAssessment: this.$store.state.intakeRiskAssessment,
    };
  },
  watch: {},
  beforeMount() {
    // to delete previously selected data
    for (let index = 0; index < this.$store.state.intakeRiskQuestions.length; index++) {
      delete this.$store.state.intakeRiskQuestions[index].score;
      delete this.$store.state.intakeRiskQuestions[index].selectedAnswerId;
    }
  },
  methods: {
    getRiskLevel(score) {
      let riskLevel = 'Low';
      if (score > 50) {
        riskLevel = 'High';
      } else if (score > 25) {
        riskLevel = 'Medium';
      }
      return riskLevel;
    },
    calculateItemScore(riskQuestions) {
      let totalPossibleScore = 0;
      const score = [...riskQuestions]
        // Convert to scores
        .map((question) => {
          const totalPossible = question.answer.map(answer => answer.score);

          totalPossible.sort((a, b) => b - a);

          totalPossibleScore += totalPossible[0]; // Now that it's sorted, get highest val
          const selectedAnswer = question.answer.filter(
            item => item.id === question.selectedAnswerId,
          );
          if (
            selectedAnswer
            && selectedAnswer[0]
            && typeof selectedAnswer[0].score !== 'undefined'
          ) {
            return selectedAnswer[0].score;
          }
          return 0;
        })
        // Sum all the scores
        .reduce((a, cur) => a + cur, 0);

      const percentage = ((score / totalPossibleScore) * 100).toFixed(2);
      // eslint-disable-next-line consistent-return
      return {
        score,
        totalPossibleScore,
        percentage,
        level: this.getRiskLevel(percentage),
      };
    },
    calculateRiskScore() {
      return this.calculateItemScore(this.intakeRiskQuestion);
      // this.totalScore = this.calculateItemScore(this.intakeRiskQuestions);
      // this.spoScore = this.calculateItemScore(this.intakeRiskQuestions.filter(item => item.isStrategicContact));
    },

    updateCategoryStatus(item, index) {
      if (item.questionNo === 1 && index === 0) {
        this.categoryList[item.category - 1].showStatus = false;
        item.showStatus = false;
      } else if (item.questionNo === 1) {
        this.categoryList[item.category - 1].showStatus = true;
        item.showStatus = true;
      }
    },
    onNextClicked() {
      if (this.$refs.intakeRiskAssessment.validate()) {
        this.$store.state.intakeRisk = true;
        this.$emit('next');
      }
    },
    reset() {
      this.$data.requireRadioButtondRule = this.data.requireRadioButtondRule;
      this.$refs.intakeRiskAssessment.reset();
    },
  },
};
</script>
<style scoped>
.risk-info-layout {
    border: solid 1px #eae8e8;
    border-radius: 6px;
    box-shadow: none !important;
}
</style>

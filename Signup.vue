<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <v-card :elevation="isMobile ? '1' : '1'" :width="isMobile ? '350' : '450'" height="540"
          class="mt-16 pa-2 card md-mx-0 mx-auto d-flex flex-column justify-space-between login-card" >

          <v-card-text class="pa-4" v-if="registering">
            <v-select
                dense
                class="mt-3"
                item-text="id"
                required
                :rules="textRules"
                outlined
                :items="admissions"
                v-model="admission"
                return-object
                placeholder="Application"
            >
              <template v-slot:item="{ item }">
                {{ item.applicationType.name + " " + item.session.name }}
              </template>
              <template v-slot:selection="{ item }">
                {{ item.applicationType.name + " " + item.session.name }}
              </template>
            </v-select>

            <v-form v-model="dataValid" ref="form">
              <div
                  v-if="
                  admission != null &&
                  admission.applicationType.autoLoadUtme === true
                "
              >
                <v-text-field
                    class="text-center mt-3"
                    outlined
                    dense
                    placeholder="UTME No. or User ID"
                    v-model="jambRegNumber"
                    required
                    :rules="textRules"
                ></v-text-field>
              </div>

              <div
                  v-if="
                  admission != null &&
                  admission.applicationType.modeOfEntryEnabled === true
                "
              >
                <v-select
                    class="mt-3"
                    :items="modeOfEntries"
                    item-text="title"
                    item-value="id"
                    outlined
                    dense

                    placeholder="Mode of entry"
                    v-model="obj.modeOfEntryId"
                    required
                    :rules="textRules"
                ></v-select>
              </div>

              <div>
                <v-text-field
                    class="mt-3"
                    required
                    :rules="emailRules"
                    outlined

                    dense
                    placeholder="Email"
                    v-model="obj.emailAddress"
                ></v-text-field>
              </div>

              <div class="">
                <v-text-field
                    :type="showPassword ? 'text' : 'password'"
                    class="mt-3"
                    outlined
                    dense

                    placeholder="Password"
                    v-model="obj.password"
                    required
                    :rules="passwordRules"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                ></v-text-field>
              </div>

              <v-text-field
                  :type="showPasswordC ? 'text' : 'password'"
                  class="mt-3"
                  outlined
                  dense
                  placeholder="Confirm Password"
                  v-model="obj.confirmPassword"
                  required
                  :rules="textRules"
                  :append-icon="showPasswordC ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="showPasswordC = !showPasswordC"
              ></v-text-field>

              <div v-if="registering">
              <v-btn
                :loading="loading"
                depressed
                height="3em"
                width="100%"
                color="primaryDark" 
                class="login-btn"
                @click="submitData"
                :disabled="!dataValid || obj.password !== obj.confirmPassword || loading || admission == null">
                Proceed
              </v-btn>

              <div class="text-left mt-2">
                Already applied?
                <a class="primary--text" @click="(e) => {
                      e.preventDefault();
                      this.registering = !this.registering;
                    }
                  ">
                  Login
                </a>
              </div>
            </div>
            </v-form>
          </v-card-text>

          <v-card-text v-else>
            <div class="my-6 mx-auto text-center">
              <v-img class="mx-auto" contain width="100" height="100" :src="logo" />
            </div>
            <v-form v-model="loginValid" ref="login" tabIndex="0">
              <v-alert v-if="!registering && usingOldReg" outlined type="info" color="primary">
                {{ newRegMessage }}
              </v-alert>
              <v-text-field
                  class="mt-4"
                  outlined
                  required
                  prepend-icon="mdi-account"
                  :rules="textRules"
                  dense
                  placeholder="Username"
                  v-model="user.username"
              ></v-text-field>

              <v-text-field
                  :type="showPasswordLogin ? 'text' : 'password'"
                  :append-icon="showPasswordLogin ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="showPasswordLogin = !showPasswordLogin"
                  class="mt-4"
                  required
                  :rules="textRules"
                  outlined
                  prepend-icon="mdi-lock"
                  dense
                  placeholder="Password"
                  v-model="user.password"
                  @keyup.enter="login"
              ></v-text-field>
              <div class="text-left my-4">
                <a
                    class="primary--text "
                    @click="
                    (e) => {
                      e.preventDefault();
                      this.registering = !this.registering;
                    }
                  "
                >Apply</a
                >
                or
                <a class="primary--text" href="/login">Reset password</a>
              </div>


              <v-btn
                height="3em"
                depressed
                color="primary"
                width="100%"
                :loading="loginLoading"
                :disabled="!loginValid"
                @click="login">
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <loading-dialog :show="loading"></loading-dialog>
    <message-box
        :show="messageShow"
        :message="message"
        :type="messageType"
        v-on:close-message="messageShow = !messageShow"
    ></message-box>
  </div>
</template>

<script>
// import LoadingDialog from "@ui/components/LoadingDialog";
import LoadingDialog from "ui/lafia/components/LoadingDialog.vue";
import MessageBox from "@ui/components/MessageBox";
import Api from "@/main/api";
import ErrorResolver from "@/shared/ErrorResolver";
import ValidationRules from "@/shared/ValidationRules";
import DateUtil from "@/shared/DateUtil";
import LoginUtil from "@/login/LoginUtil";
import Roles from "@/shared/Roles";
import XButton from "@ui/widgets/XButton.vue";
import XTextField from "@ui/widgets/XTextField.vue";
import XSelect from "@ui/widgets/XSelect.vue";
export default {
  name: "Signup",
  components: {XSelect, XTextField, XButton, MessageBox, LoadingDialog },
  props: ["logo"],
  data: () => ({
    obj: {},
    jambRegNumber: null,
    utmeYear: "",
    messageType: "",
    message: "",
    messageShow: false,
    loading: false,
    admissions: [],
    admission: null,
    modeOfEntries: [],
    registering: true,
    years: DateUtil.getYearsArray(2010),
    dataValid: true,
    loginValid: true,
    loginLoading: false,
    textRules: ValidationRules.textRules,
    emailRules: ValidationRules.emailRules,
    passwordRules: ValidationRules.passwordRules,
    showPassword: false,
    showPasswordC: false,
    showPasswordLogin: false,
    user: {
      applicant: true,
    },
    usingOldReg: false,
    newRegMessage: "",
  }),

  methods: {
    getAdmissions() {
      this.loading = true;
      Api.admission
          .getActiveAdmissions()
          .then((res) => {
            this.admissions = res.data;
          })
          .catch((err) => ErrorResolver.checkErrors(this, err))
          .finally(() => (this.loading = false));
    },

    loadModeOfEntries() {
      if (this.admission != null) {
        this.modeOfEntries = [];
        Api.system
            .modeOfEntries(this.admission.session.programmeType.id)
            .then((res) => (this.modeOfEntries = res.data))
            .catch((err) => ErrorResolver.checkErrors(this, err));
      }
    },

    submitData() {
      if (
          this.admission != null &&
          this.admission.applicationType.autoLoadUtme === true
      ) {
        // validate utme first
        // validate utme
        this.loading = true;
        let vm = this;
        Api.applicants
            .validateUTME({
              registrationNumber: this.jambRegNumber,
              admissionId: this.admission.id,
            })
            .then(() => {
              // this.message = "Validation successful";
              // this.messageType = "success";
              // this.messageShow = true;
              this.register();
            })
            .catch((err) => {
              ErrorResolver.checkErrors(vm, err);
              this.loading = false;
            });
      } else {
        // go ahead with registration
        this.register();
      }
    },

    register() {
      this.loading = true;
      this.obj.admissionId = this.admission.id;
      this.obj.jambRegNumber = this.jambRegNumber;
      Api.applicants
          .register(this.obj)
          .then(() => {
            this.message = "Account created successfully";
            this.messageType = "success";
            this.messageShow = true;
            this.registering = false;
          })
          .catch((err) => {
            ErrorResolver.checkErrors(this, err);
          })
          .finally(() => (this.loading = false));
    },

    login() {
      // input must be valid
      if (!this.loginValid) return;

      this.loginLoading = true;
      Api.auth
          .login(this.user)
          .then((res) => {
            // if using old reg no.
            if (res.data.old) {
              this.usingOldReg = true;
              this.newRegMessage =
                  "Use your new ID: (" + res.data.applicant + ") to login";
              return;
            }
            // check
            if (!Roles.contains(res.data.roles, Roles.Applicant)) {
              window.location.href = "/login";
              return;
            }
            // save to cookie
            LoginUtil.setAccessToken(res.data.jwt);
            LoginUtil.setRefreshToken(res.data.refreshToken);
            window.location.href = "/application#/dashboard";
            // reload
            window.canReload = true;
          })
          .catch((err) => {
            ErrorResolver.checkErrors(this, err);
          })
          .finally(() => {
            this.loginLoading = false;
          });
    },
  },

  computed: {
    isMobile: function () {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  watch: {
    admission: function (val) {
      this.$refs.form.reset()
      if (val != null && val.applicationType.modeOfEntryEnabled) {
        this.modeOfEntries = this.admission.applicationType.modeOfEntries
      }
    },
  },

  created() {
    this.getAdmissions();
  },
};
</script>

<style lang="scss" scoped>
.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(87, 67, 14, 0.15);
  border-radius: 16px;
  overflow: hidden;
}

.logo-container {
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
}

.login-form {
  padding: 0 1rem;
}

.login-btn {
  border-radius: 12px;
  text-transform: none;
  letter-spacing: 0.5px;
  font-weight: 500;
  font-size: 1.1em;
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #57430E, #AE8B31) !important;
  position: relative;
  overflow: hidden;

  &:not(:disabled) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(87, 67, 14, 0.25) !important;
      
      &::after {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }

  &:disabled {
    opacity: 0.7;
    background: linear-gradient(45deg, #8B7340, #C4A86B) !important;
  }
}
</style>

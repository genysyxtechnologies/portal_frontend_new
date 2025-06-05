<template>
    <x-card style="min-height: 50em" class="rounded-lg pb-6">
        <x-card-title class="d-flex mx-md-5 py-1">
            Fees
            <v-select v-if="isMediumAndUp" dense class="d-flex ml-auto pt-0 pb-0" :items="sessions"
                v-model="selectedSession" return-object item-text="name" placeholder="Select session"
                style="max-width: 20%"></v-select>
            <v-select v-if="isMediumAndUp && isSemesterBased" dense class="mt-1 mx-2" :items="semesters"
                v-model="selectedSemester" return-object item-text="title" placeholder="Select semester"
                style="max-width: 20%"></v-select>
        </x-card-title>


        <v-divider />

        <x-card-text>
            <!--  body div  -->
            <div :class="{ 'flex-grow-1 d-flex flex-column': true }">

                <div>
                    <x-select v-if="isMobile" outlined dense class="mt-3 mx-2" :items="sessions"
                        v-model="selectedSession" return-object item-text="name"
                        placeholder="Select session"></x-select>
                </div>
                <div class="mx-2">
                    <v-select v-if="isMobile && isSemesterBased" outlined dense class="mt-3 mx-2" :items="semesters"
                        v-model="selectedSemester" return-object item-text="title"
                        placeholder="Select semester"></v-select>
                </div>
                <div v-if="!paymentActionEnable" class="d-flex flex-column justify-start flex-grow-1">
                    <div class="mx-auto basic--text mt-2 mt-md-12" style="width: 100%">
                        <v-alert type="info" color="primary" width="100%">
                            Welcome, please select a session to make payment to
                        </v-alert>
                        <!-- <div align="center" class="mt-4"><v-btn color="primary" rounded elevation="0" @click.once="initializeTransaction" :disabled="selectedSession == null || loading">Begin Transaction</v-btn></div> -->
                    </div>
                </div>
                <div v-else>
                    <v-row>
                        <v-col cols="12" md="4">
                            <x-card :maxwidth="400" class="rounded-lg" elevation="6" outlined
                                style="border-color: #a6821e">
                                <x-card-title style="color: black;">Information</x-card-title>
                                <v-divider style="background-color: #EDBE44" />
                                <x-card-text>
                                    <div class="d-flex">
                                        <div class="flex-grow-1">
                                            <div class="d-flex flex-wrap flex-md-nowrap mb-4">
                                                <div v-if="isMobile" class="basic--text font-weight-bold ml-auto">
                                                    &#8358;{{
                                                        totalAmount }}
                                                </div>
                                                <v-progress-linear rounded="xl" class="flex-grow-1 my-auto ml-lg-0"
                                                    height="20" color="primary lighten-1"
                                                    background-color="primary lighten-5"
                                                    :value="((feePayment !== null && feePayment.clearMode === 'WAIVER') ? 100 : (amountPaid / totalAmount) * 100).toFixed()">
                                                    <template v-slot:default="{}">
                                                        <strong>{{ (feePayment == null || (parts == null || parts.length
                                                            === 0)) ? 0.00 :
                                                            (feePayment.cleared ? 100 : ((amountPaid / totalAmount) *
                                                            100).toFixed())
                                                            }}%</strong>
                                                    </template>
                                                </v-progress-linear>
                                            </div>

                                            <div class="font-weight-bold" style="color: black">History</div>
                                            <div v-if="feePayment == null" class="mt-6">
                                                No history found
                                            </div>

                                            <div v-else>
                                                <v-list v-for="(item, index) in parts.filter(e => !!e.amountPaid)"
                                                    :key="index">
                                                    <v-list-item class="pl-0">
                                                        <v-list-item-content class="pl-0 font-weight-medium">
                                                            {{ new
                                                                Date(item.paymentDate).toLocaleString().substr(0,
                                                                    10) + ' - &#8358;' +
                                                                (item.amountPaid)
                                                            }}
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                    <v-divider style="background-color: #EDBE44" />
                                                </v-list>
                                            </div>

                                            <v-divider style="background-color: #EDBE44" class="mt-10" />
                                            <!--  Invoice action  -->
                                            <div class="mt-10" style="width: 100%">
                                                <!-- if it's just one invoice -->
                                                <v-btn color="basic" depressed width="100%"
                                                    class="ml-auto white--text mb-6" :key="btn2"
                                                    @click.once="downloadInvoice(feePayment.transactionId)"
                                                    v-if="feePayment != null && feePayment.partPayments.length < 2"
                                                    :disabled="loading">
                                                    Download Invoice</v-btn>

                                                <v-menu
                                                    v-else-if="feePayment != null && feePayment.partPayments.length > 1"
                                                    transition="slide-y-transition" left>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn class="mt-4" width="100%" color="primary" dark depressed
                                                            v-bind="attrs" v-on="on">
                                                            Download Invoice
                                                        </v-btn>
                                                    </template>
                                                    <v-list>
                                                        <v-list-item v-for="(item, index) in feePayment.partPayments"
                                                            link :disabled="!paymentActionEnable || loading"
                                                            :key="index + 1" @click="downloadInvoice(item.invoice)">
                                                            <v-list-item-title>Invoice {{ index + 1 }}</v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>

                                                <!-- Invoice menu -->
                                                <v-btn class="mt-4" width="100%" color="primary" dark depressed
                                                    :disabled="amountPaid >= totalAmount || loading"
                                                    v-if="feePayment == null && !getUser.programme.programmeType.partPayment"
                                                    @click="initializeTransaction(true, false)">
                                                    Generate Invoice
                                                </v-btn>
                                                <v-menu transition="slide-y-transition" left
                                                    v-else-if="feePayment == null">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn class="mt-4" width="100%" color="primary" dark depressed
                                                            v-bind="attrs" v-on="on"
                                                            :disabled="amountPaid >= totalAmount || loading"
                                                            v-if="feePayment == null">
                                                            Generate Invoice
                                                        </v-btn>
                                                    </template>
                                                    <v-list>
                                                        <!-- Full -->
                                                        <v-list-item link :disabled="!paymentActionEnable || loading"
                                                            :key="btn1" @click="initializeTransaction(true, false)">
                                                            <v-list-item-title>Full</v-list-item-title>
                                                        </v-list-item>
                                                        <!-- Part -->
                                                        <v-list-item link :disabled="!paymentActionEnable || loading"
                                                            v-if="getUser.programme.programmeType.partPayment"
                                                            :key="btn3" @click="initializeTransaction(false, false)">
                                                            <v-list-item-title>Part</v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                                <!-- for balance invoice -->
                                                <v-btn color="primary" width="100%" depressed class="ml-auto mt-6"
                                                    :disabled="amountPaid >= totalAmount || loading || feePayment.cleared"
                                                    v-if="feePayment != null && feePayment.partPayments.length > 0 && isBalancePayment"
                                                    @click="initializeTransaction(true, false)">Balance Invoice</v-btn>
                                                <v-btn color="info" width="100%" depressed class="ml-auto mt-6"
                                                    :disabled="amountPaid >= totalAmount || loading || feePayment.cleared || feePayment.partPayments.length > 0"
                                                    v-if="feePayment != null && feePayment.partPayments.length < 1"
                                                    :key="btn4" @click="makePayment(feePayment.paymentLink)">Pay
                                                    Now</v-btn>
                                                <v-menu transition="slide-y-transition" left
                                                    v-else-if="feePayment != null && !feePayment.cleared && feePayment.partPayments.length > 1">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn class="mt-4" width="100%" color="info" dark depressed
                                                            v-bind="attrs" v-on="on"
                                                            :disabled="amountPaid >= totalAmount || loading">
                                                            Pay now
                                                        </v-btn>
                                                    </template>
                                                    <v-list>
                                                        <v-list-item v-for="(item, index) in feePayment.partPayments"
                                                            link
                                                            :disabled="!paymentActionEnable || loading || item.success"
                                                            :key="index + 100"
                                                            @click.once="makePayment(item.paymentLink, item)">
                                                            <v-list-item-title>Pay for invoice {{ item.invoice }} <span
                                                                    v-if="item.success" class="primary--text"> -
                                                                    Paid</span></v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                            </div>
                                        </div>
                                    </div>
                                </x-card-text>
                            </x-card>
                        </v-col>

                        <v-col cols="12" md="8">
                            <v-sheet v-if="!$vuetify.breakpoint.xs" min-height="180mm" width="180mm" id="doc" outlined
                                rounded="lg" class="d-flex flex-column"
                                style="outline: 2px solid #AE8B31  /* size of A4 paper */">
                                <div>
                                    <v-sheet class="mt-8 mx-auto pa-4">
                                        <v-simple-table dense>
                                            <tbody>
                                                <tr style="height: 4em; border: none">
                                                    <th style="width: 15%">Name</th>
                                                    <td style="width: 35%">{{ getUser.name }}</td>
                                                    <th style="width: 15%">Matric:</th>
                                                    <td style="width: 30%">{{ getUser.userId }}</td>
                                                </tr>
                                                <tr style="height: 4em; border: none">
                                                    <th style="width: 15%">Faculty</th>
                                                    <td style="width: 35%" class="text-left">{{
                                                        getUser.programme.department.faculty.name }}
                                                    </td>
                                                    <th style="width: 15%">Department:</th>
                                                    <td style="width: 30%">{{
                                                        getUser.programme.department.name }}</td>
                                                </tr>
                                                <tr style="height: 4em; border: none">
                                                    <th style="width: 15%">Programme</th>
                                                    <td style="width: 35%" class="text-left">{{
                                                        getUser.programme.name }}</td>
                                                    <th style="width: 15%">Level</th>
                                                    <td style="width: 30%">{{ paymentInfo != null ?
                                                        paymentInfo.level.title : getUser.level.title }}
                                                    </td>
                                                </tr>
                                                <tr style="height: 4em; border: none">
                                                    <th style="width: 15%">Session</th>
                                                    <td style="width: 35%" class="text-left">{{
                                                        selectedSession != null ?
                                                            selectedSession.name : ''
                                                    }}</td>
                                                    <th style="width: 15%">Date</th>
                                                    <td style="width: 35%" class="text-left">{{ new
                                                        Date().toLocaleString() }}</td>
                                                </tr>
                                                <tr style="height: 4em; border: none">
                                                    <th style="width: 15%">Email</th>
                                                    <td style="width: 35%" class="text-left">{{
                                                        getUser.email }}</td>
                                                    <th style="width: 15%">Invoice</th>
                                                    <td style="width: 35%" class="text-left">{{ feePayment
                                                        != null ? feePayment.transactionId
                                                        : 'Not generated'
                                                        }}</td>
                                                </tr>
                                            </tbody>
                                        </v-simple-table>
                                    </v-sheet>

                                    <v-divider class="mt-10" style="background-color: #EDBE44" />

                                    <v-sheet rounded="lg" outlined class="mx-5 mt-8" color="primary">
                                        <v-simple-table dense>
                                            <thead>
                                                <tr>
                                                    <th>S/N</th>
                                                    <th>Title</th>
                                                    <th class="text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, index) in itemsWithSerialNo" :key="index">
                                                    <td>{{ item.sno }}</td>
                                                    <td>{{ item.itemTitle.title }}</td>
                                                    <td class="text-right">{{ item.amount }}</td>
                                                </tr>
                                            </tbody>
                                        </v-simple-table>
                                    </v-sheet>
                                    <div class="py-5 text-right mx-5 font-weight-bold mt-3">Total:{{ ' &#8358; ' +
                                        totalAmount }}</div>
                                </div>
                            </v-sheet>


                            <!-- MOBILE DISPLAY-->
                            <v-sheet height="150mm" v-else style="outline: 2px solid #AE8B31; overflow-x: scroll;"
                                outlined rounded="lg">
                                <v-simple-table dense>
                                    <v-simple-table dense>
                                        <tbody>
                                            <tr style="height: 4em; border: none">
                                                <th style="width: 15%">Name</th>
                                                <td style="width: 35%">{{ getUser.name }}</td>
                                                <th style="width: 15%">Matric:</th>
                                                <td style="width: 30%">{{ getUser.userId }}</td>
                                            </tr>
                                            <tr style="height: 4em; border: none">
                                                <th style="width: 15%">Faculty</th>
                                                <td style="width: 35%" class="text-left">{{
                                                    getUser.programme.department.faculty.name }}
                                                </td>
                                                <th style="width: 15%">Department:</th>
                                                <td style="width: 30%">{{
                                                    getUser.programme.department.name }}</td>
                                            </tr>
                                            <tr style="height: 4em; border: none">
                                                <th style="width: 15%">Programme</th>
                                                <td style="width: 35%" class="text-left">{{
                                                    getUser.programme.name }}</td>
                                                <th style="width: 15%">Level</th>
                                                <td style="width: 30%">{{ paymentInfo != null ?
                                                    paymentInfo.level.title : getUser.level.title }}
                                                </td>
                                            </tr>
                                            <tr style="height: 4em; border: none">
                                                <th style="width: 15%">Session</th>
                                                <td style="width: 35%" class="text-left">{{
                                                    selectedSession != null ?
                                                        selectedSession.name : ''
                                                }}</td>
                                                <th style="width: 15%">Date</th>
                                                <td style="width: 35%" class="text-left">{{ new
                                                    Date().toLocaleString() }}</td>
                                            </tr>
                                            <tr style="height: 4em; border: none">
                                                <th style="width: 15%">Email</th>
                                                <td style="width: 35%" class="text-left">{{
                                                    getUser.email }}</td>
                                                <th style="width: 15%">Invoice</th>
                                                <td style="width: 35%" class="text-left">{{ feePayment
                                                    != null ? feePayment.transactionId
                                                    : 'Not generated'
                                                    }}</td>
                                            </tr>
                                            <tr v-if="isSemesterBased">
                                                <th style="width: 15%">Semester</th>
                                                <td style="width: 35%" class="text-left" colspan="3">{{
                                                    feePayment?.semester?.title ?? '' }}</td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-simple-table>


                                <v-simple-table dense>
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Title</th>
                                            <th class="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        <tr v-for="(item, index) in itemsWithSerialNo" :key="index">
                                            <td>{{ item.sno }}</td>
                                            <td>{{ item.itemTitle.title }}</td>
                                            <td class="text-right">{{ item.amount }}</td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>

                                <div class="py-5 text-right mx-5 font-weight-bold mt-3">Total:{{ ' &#8358; ' +
                                    totalAmount }}</div>
                            </v-sheet>
                        </v-col>
                    </v-row>

                    <!-- <div id="doc-main" class="d-flex flex-column flex-lg-row justify-space-between"
                            style="height: 100%;">
                            <div :class="{ 'mx-4': isMediumAndUp, 'mx-2': isMobile, 'mr-lg-2 mb-4': true, 'ax mx-auto': (!isLargeAndUp && !isMobile) }">

                            </div>
                            <div class="mx-auto ml-lg-6 mr-lg-0 pl-lg-1 flex-lg-grow-1" v-if="isMediumAndUp">

                            </div>
                        </div> -->
                </div>

            </div>
        </x-card-text>

        <loading-dialog :show="loading"></loading-dialog>
        <message-box :show="messageShow" :message="message" :type="messageType"
            v-on:close-message="messageShow = !messageShow"></message-box>
    </x-card>
</template>


<script>
import { mapGetters } from "vuex";
import Roles from "shared/Roles";
import XCard from  '@ui/components/XCard.vue';
import XCardText from  '@ui/components/XCardText.vue';
import XCardTitle from  '@ui/components/XCardTitle.vue';
import XSelect from 'ui/lafia/widgets/XSelect.vue';
import LoadingDialog from "@ui/components/LoadingDialog";
import MessageBox from "@ui/components/MessageBox";
import Api from 'main/api';
import { PaymentGateway } from "shared/PaymentGateway";
import GateWays from "shared/GateWays";
import Links from "shared/constants/Links";
import ErrorResolver from "@/shared/ErrorResolver";
import LoginUtil from "@/login/LoginUtil";
import PaymentModes from "shared/PaymentModes";


export default {
    name: "Fees",
    components: {
        XSelect,
        XCard,
        XCardText,
        XCardTitle,
        LoadingDialog,
        MessageBox
    },

    data: () => ({
        messageType: '',
        message: '',
        messageShow: false,
        loading: false,
        tab: null,
        feePayment: null,
        items: [],
        paymentInfo: null,
        sessions: [],
        selectedSession: null,
        parts: [], // parts
        payPart: false,
        amountToPay: 0,
        paymentGateway: null,
        paymentConfig: null,
        isSemesterBased: false,
        selectedSemester: null,
        semesters: [],
        btn1: 1,
        btn2: 100,
        btn3: 1000,
        btn4: 2000,
        btn5: 3000,
    }),

    computed: {
        ...mapGetters(['getUser']),
        isLargeAndUp: function () {
            return this.$vuetify.breakpoint.lgAndUp
        },

        isMobile: function () {
            return this.$vuetify.breakpoint.smAndDown
        },

        isMedium: function () {
            return this.$vuetify.breakpoint.mdOnly
        },

        isMediumAndDown: function () {
            return this.$vuetify.breakpoint.mdAndDown
        },


        isMediumAndUp: function () {
            return this.$vuetify.breakpoint.mdAndUp
        },

        itemsWithSerialNo() {
            return this.items.map((d, index) => ({ ...d, sno: index + 1 }))
        },

        totalAmount: function () {
            return this.items.map(value => value.amount).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
        },

        isBalancePayment: function () {
            return (this.feePayment != null && this.feePayment.partPayments.length > 0 && !this.feePayment.cleared) ||
                (this.amountPaid < this.totalAmount && this.feePayment.partPayments.length > 0)
        },

        amountPaid: function () {
            if (this.feePayment != null && this.feePayment.cleared)
                return this.totalAmount

            if (this.parts != null && this.parts.length < 1) {
                return 0;
            }

            return this.parts.map(e => e.amountPaid).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
        },

        canClickPay: function () {
            return /^[123456789]\d*(\.\d{0,8})?$/.test(this.amountToPay) && Number.parseFloat(this.amountToPay) <= (this.totalAmount - this.amountPaid)
        },

        isApplicant: function () {
            return this.getUser != null && Roles.contains(this.getUser.roles, Roles.Applicant)
        },
        paymentActionEnable: function () {
            return (this.isSemesterBased && !!this.selectedSemester) || (!this.isSemesterBased && !!this.selectedSession)
        }
    },


    methods: {
        remountClickOnce() {
            this.btn1++;
            this.btn2++;
            this.btn3++;
            this.btn4++;
            this.btn5++;
        },
        getPayment() {
            if (this.getUser != null && this.selectedSession != null) {
                this.loading = true;
                this.feePayment = null
                this.items = [];
                this.parts = [];
                Api.schoolFees.getFeeFor(this.selectedSession.id, this.getUser.userId, this.selectedSemester?.id ?? null)
                    .then(res => {
                        this.feePayment = res.data.feePayment
                        this.items = res.data.feeItems
                        console.log(res.data)
                        this.paymentInfo = res.data
                        if (res.data.feePayment != null) {
                            this.parts = this.feePayment.partPayments

                        }
                    }).catch(err => ErrorResolver.checkErrors(this, err))
                    .finally(() => this.loading = false)
            }
        },

        initializeTransaction(full, payNow) {
            if (this.getUser != null && this.paymentActionEnable) {
                this.loading = true;
                Api.schoolFees.initializePayment({
                    sessionId: this.selectedSession.id,
                    studentReg: this.getUser.userId,
                    full: full,
                    semesterId: this.selectedSemester?.id ?? null
                })
                    .then(res => {
                        this.message = 'Invoice generated'
                        this.messageType = 'success'
                        this.messageShow = true
                        this.feePayment = res.data
                        if (payNow) {
                            this.makePayment()
                        }
                    }).catch(err => ErrorResolver.checkErrors(this, err))
                    .finally(() => this.loading = false)
            }
        },

        // invoice download
        downloadInvoice(invoice) {
            this.loading = true;
            Api.schoolFees.invoice(invoice)
                .then(res => {
                    let fileURL = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                    let fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', 'invoice.pdf');
                    document.body.appendChild(fileLink);

                    fileLink.click();
                    fileLink.remove();
                }).catch(() => {
                    // ErrorReslover.checkErrors(this, err);
                    this.message = "Failed to Download Invoice"
                    this.messageType = "error"
                    this.messageShow = true
                    // err.message = "Failed to Download Invoice"
                }).finally(() => this.loading = false)
        },

        // TODO: To be removed
        refreshTransaction() {
            if (this.getUser != null && this.selectedSession != null && this.feePayment != null) {
                this.loading = true;
                Api.schoolFees.refreshTransaction(this.feePayment.id)
                    .then(res => {
                        this.getPayment()
                        this.feePayment = res.data;
                        this.message = 'Transaction refreshed'
                        this.messageType = 'success'
                        this.messageShow = true
                    }).catch(err => ErrorResolver.checkErrors(this, err))
                    .finally(() => this.loading = false)
            }
        },

        // eslint-disable-next-line no-unused-vars
        makePayment(link, payment) {
            if (this.feePayment != null || payment != null) {
                if (this.paymentConfig.inline) {
                    this.paymentGateway.makePayment({
                        email: this.getUser.email,
                        amount: this.payPart ? this.amountToPay : (this.totalAmount - this.amountPaid),
                        currency: 'NGN',
                        invoice: payment?.invoice ?? this.feePayment.transactionId,
                        paymentId: payment?.feePayment?.id ?? this.feePayment.id
                    }, () => {
                        // if its an applicant, logout 'em out
                        if (this.isApplicant) {
                            LoginUtil.resetAccessToken()
                            LoginUtil.resetRefreshToken()
                            window.location.href = '/login'
                        } else {
                            window.location.reload()
                        }
                    }, (invoice) => {
                        // process
                        this.loading = true
                        Api.payment.processInline(invoice)
                            .then(() => {
                                window.location.href = "/application"
                            }).catch(err => {
                                ErrorResolver.checkErrors(this, err)
                                this.loading = false
                            })
                    })
                } else {
                    // payment should not be done inline
                    // open window for payment
                    this.loading = true
                    window.location.href = link
                }
            }
        },

        fetchSessionsForPayment() {
            if (this.getUser != null) {
                this.loading = true;
                Api.session.getSessionsForPayment(this.getUser.userId)
                    .then(res => this.sessions = res.data)
                    .catch(err => ErrorResolver.checkErrors(this, err))
                    .finally(() => this.loading = false);
            }
        },

        fetchSemestersForPayment() {
            if (this.getUser != null && this.selectedSession) {
                this.loading = true;
                Api.semester.getPaidAndPending(this.getUser.userId, this.selectedSession.id)
                    .then(res => this.semesters = res.data)
                    .catch(err => ErrorResolver.checkErrors(this, err))
                    .finally(() => this.loading = false);
            }
        },

        print() {
            window.print()
        },
    },


    watch: {
        selectedSession: function (newVal) {
            this.isSemesterBased = false
            if (newVal != null) {
                this.isSemesterBased = newVal.paymentMode == PaymentModes.SEMESTER.text
                if (this.isSemesterBased) {
                    this.fetchSemestersForPayment()
                } else {
                    this.getPayment()
                }
            }
        },

        selectedSemester: function (val) {
            val && this.getPayment()
        },


        getUser: function () {
            this.fetchSessionsForPayment()
        },

        loading: function (val) {
            if (val) {
                this.remountClickOnce()
            }
        }
    },

    created() {
        this.fetchSessionsForPayment()
    },



    mounted() {
        // initialize gateway
        this.$nextTick(() => {
            this.paymentGateway = new PaymentGateway(GateWays.REMITA, this, Links.payments.processInlinePayment)
            Api.paymentPlatforms.getActive()
                .then(res => {
                    if (this.paymentGateway != null) {
                        // set config
                        this.paymentConfig = res.data
                        // if inline, initialize
                        if (res.data.inline)
                            this.paymentGateway.initializeGateway(res.data)
                    } else {
                        this.message = 'An error hs occurred'
                        this.messageType = 'error'
                        this.messageShow = true
                    }
                }).catch(err => ErrorResolver.checkErrors(this, err))

        })
    }
}
</script>



<style scoped>
.ax {
    width: 210mm
}

@media print {
    #doc {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999;
    }

    #actions {
        display: none;
        height: 0;
        width: 0;
    }
}

@page {
    margin: 0;
}

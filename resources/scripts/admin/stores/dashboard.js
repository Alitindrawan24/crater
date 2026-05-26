import axios from 'axios'
import { defineStore } from 'pinia'
import { useGlobalStore } from '@/scripts/admin/stores/global'
import { handleError } from '@/scripts/helpers/error-handling'

export const useDashboardStore = (useWindow = false) => {
  const defineStoreFunc = useWindow ? window.pinia.defineStore : defineStore
  const { global } = window.i18n

  return defineStoreFunc({
    id: 'dashboard',

    state: () => ({
      stats: {
        totalAmountDue: 0,
        totalCustomerCount: 0,
        totalInvoiceCount: 0,
        totalEstimateCount: 0,
      },

      chartData: {
        months: [],
        invoiceTotals: [],
        expenseTotals: [],
        receiptTotals: [],
        netIncomeTotals: [],
      },

      totalSales: null,
      totalReceipts: null,
      totalExpenses: null,
      totalNetIncome: null,

      recentDueInvoices: [],
      recentEstimates: [],

      dateRange: { from_date: null, to_date: null },

      invoices: [],
      invoicePagination: { currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 },

      payments: [],
      paymentPagination: { currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 },

      isDashboardDataLoaded: false,
    }),

    actions: {
      loadData(params) {
        return new Promise((resolve, reject) => {
          axios
            .get(`/api/v1/dashboard`, { params })
            .then((response) => {
              // Stats
              this.stats.totalAmountDue = response.data.total_amount_due
              this.stats.totalCustomerCount = response.data.total_customer_count
              this.stats.totalInvoiceCount = response.data.total_invoice_count
              this.stats.totalEstimateCount = response.data.total_estimate_count

              // Dashboard Chart
              if (this.chartData && response.data.chart_data) {
                this.chartData.months = response.data.chart_data.months
                this.chartData.invoiceTotals =
                  response.data.chart_data.invoice_totals
                this.chartData.expenseTotals =
                  response.data.chart_data.expense_totals
                this.chartData.receiptTotals =
                  response.data.chart_data.receipt_totals
                this.chartData.netIncomeTotals =
                  response.data.chart_data.net_income_totals
              }

              // Dashboard Chart Labels
              this.totalSales = response.data.total_sales
              this.totalReceipts = response.data.total_receipts
              this.totalExpenses = response.data.total_expenses
              this.totalNetIncome = response.data.total_net_income

              // Dashboard Table Data
              this.recentDueInvoices = response.data.recent_due_invoices
              this.recentEstimates = response.data.recent_estimates

              this.dateRange = response.data.date_range || { from_date: null, to_date: null }

              this.isDashboardDataLoaded = true

              resolve(response)
            })
            .catch((err) => {
              handleError(err)
              reject(err)
            })
        })
      },

      fetchDashboardInvoices(page = 1) {
        return new Promise((resolve, reject) => {
          axios
            .get('/api/v1/invoices', {
              params: {
                from_date: this.dateRange.from_date,
                to_date: this.dateRange.to_date,
                limit: 10,
                page,
              },
            })
            .then((response) => {
              this.invoices = response.data.data
              const meta = response.data.meta
              this.invoicePagination = {
                currentPage: response.data.meta?.current_page ?? page,
                totalPages: response.data.meta?.last_page ?? 1,
                totalCount: meta?.total ?? 0,
                limit: 10,
              }
              resolve(response)
            })
            .catch((err) => {
              handleError(err)
              reject(err)
            })
        })
      },

      fetchDashboardPayments(page = 1) {
        return new Promise((resolve, reject) => {
          axios
            .get('/api/v1/payments', {
              params: {
                from_date: this.dateRange.from_date,
                to_date: this.dateRange.to_date,
                limit: 10,
                page,
              },
            })
            .then((response) => {
              this.payments = response.data.data
              const meta = response.data.meta
              this.paymentPagination = {
                currentPage: response.data.meta?.current_page ?? page,
                totalPages: response.data.meta?.last_page ?? 1,
                totalCount: meta?.total ?? 0,
                limit: 10,
              }
              resolve(response)
            })
            .catch((err) => {
              handleError(err)
              reject(err)
            })
        })
      },
    },
  })()
}

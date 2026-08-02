import React, { useState, useEffect } from 'react'
import { productAPI, clientAPI, invoiceAPI } from '../services/api'
import { Package, Users, FileText, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, clients: 0, invoices: 0, revenue: 0 })
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [productsRes, clientsRes, invoicesRes] = await Promise.all([
        productAPI.getAll(),
        clientAPI.getAll(),
        invoiceAPI.getAll(),
      ])

      const invoices = invoicesRes.data || []
      const revenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0)

      setStats({
        products: productsRes.data?.length || 0,
        clients: clientsRes.data?.length || 0,
        invoices: invoices.length,
        revenue: revenue.toFixed(2),
      })

      setRecentInvoices(invoices.slice(0, 5))
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${color}`}>
        <Icon size={32} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Overview of your billing system</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Package} label="Total Products" value={stats.products} color="bg-blue-500" />
            <StatCard icon={Users} label="Total Clients" value={stats.clients} color="bg-green-500" />
            <StatCard icon={FileText} label="Total Invoices" value={stats.invoices} color="bg-purple-500" />
            <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.revenue}`} color="bg-secondary" />
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Recent Invoices</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Invoice</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{invoice.invoiceNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{invoice.client?.company || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">₹{invoice.grandTotal?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

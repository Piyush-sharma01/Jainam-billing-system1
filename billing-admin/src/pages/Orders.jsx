import React, { useEffect, useState } from "react";
import { orderAPI } from "../services/api";
import { Package, ChevronDown, ChevronUp, Phone, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  NEW: "bg-blue-100 text-blue-700",
  ACKNOWLEDGED: "bg-amber-100 text-amber-700",
  INVOICED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getAll();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };

  const stats = {
    total: orders.length,
    new: orders.filter((o) => o.status === "NEW").length,
    acknowledged: orders.filter((o) => o.status === "ACKNOWLEDGED").length,
    invoiced: orders.filter((o) => o.status === "INVOICED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Orders placed by your clients through the storefront
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-400 text-sm">New</p>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-400 text-sm">Acknowledged</p>
          <p className="text-2xl font-bold text-amber-600">{stats.acknowledged}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-400 text-sm">Invoiced</p>
          <p className="text-2xl font-bold text-green-600">{stats.invoiced}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <Package size={36} className="mx-auto mb-3" />
            No orders yet. Orders placed by your clients on the storefront will show up here.
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => {
              const isOpen = expandedId === order.id;
              return (
                <div key={order.id}>
                  <button
                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                    className="w-full flex flex-wrap items-center gap-3 p-4 text-left hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Building2 size={14} /> {order.client?.company}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"}
                    </div>
                    <div className="font-bold text-gray-800">
                      ₹{Number(order.grandTotal).toFixed(2)}
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-gray-400">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 bg-gray-50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="bg-white rounded-lg border p-3">
                          <p className="text-gray-400 mb-1">Client</p>
                          <p className="font-medium text-gray-800">{order.client?.company}</p>
                          <p className="text-gray-600">{order.client?.contactPerson}</p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Phone size={12} /> {order.client?.phone}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg border p-3">
                          <p className="text-gray-400 mb-1">Order Summary</p>
                          <p className="text-gray-600">Subtotal: ₹{Number(order.subtotal).toFixed(2)}</p>
                          <p className="text-gray-600">Tax: ₹{Number(order.taxAmount).toFixed(2)}</p>
                          <p className="font-semibold text-gray-800">
                            Total: ₹{Number(order.grandTotal).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border overflow-hidden mb-4">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-2 text-left">Product</th>
                              <th className="p-2 text-center">Qty</th>
                              <th className="p-2 text-right">Unit Price</th>
                              <th className="p-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(order.items || []).map((item) => (
                              <tr key={item.id} className="border-t">
                                <td className="p-2">{item.productName}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">₹{Number(item.unitPrice).toFixed(2)}</td>
                                <td className="p-2 text-right">₹{Number(item.total).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {order.status === "NEW" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "ACKNOWLEDGED")}
                            className="bg-amber-500 text-white px-3 py-1.5 rounded text-sm hover:bg-amber-600"
                          >
                            Acknowledge
                          </button>
                        )}
                        {order.status !== "CANCELLED" && order.status !== "INVOICED" && (
                          <button
                            onClick={() =>
                              navigate("/catalogue", {
                                state: {
                                  fromOrder: {
                                    clientId: order.client?.id,
                                    notes: order.notes,
                                    items: (order.items || []).map((item) => ({
                                      productId: item.productId,
                                      quantity: item.quantity,
                                    })),
                                  },
                                },
                              })
                            }
                            className="bg-primary text-white px-3 py-1.5 rounded text-sm hover:bg-blue-800"
                          >
                            Create Invoice
                          </button>
                        )}
                        {order.status === "ACKNOWLEDGED" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "INVOICED")}
                            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
                          >
                            Mark Invoiced
                          </button>
                        )}
                        {order.status !== "CANCELLED" && order.status !== "INVOICED" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "CANCELLED")}
                            className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

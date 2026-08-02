import React, { useState, useEffect } from "react";
import { clientAPI } from "../services/api";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    phone: "",
    email: "",
    gstNumber: "",
    address: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll();
      setClients(response.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await clientAPI.update(editingId, formData);
      } else {
        await clientAPI.create(formData);
      }

      setFormData({
        company: "",
        contactPerson: "",
        phone: "",
        email: "",
        gstNumber: "",
        address: "",
      });

      setEditing(false);
      setEditingId(null);
      setShowForm(false);

      loadClients();
    } catch (error) {
      console.error(error);
      alert("Operation failed");
    }
  };
  const handleEdit = (client) => {
    setEditing(true);
    setEditingId(client.id);

    setFormData({
      company: client.company,
      contactPerson: client.contactPerson,
      phone: client.phone,
      email: client.email,
      gstNumber: client.gstNumber,
      address: client.address,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this client?")) {
      return;
    }

    try {
      await clientAPI.delete(id);
      loadClients();
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate client");
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Clients</h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage your clients</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Client
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4"
        >
          <input
            className="w-full border p-2 rounded"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <input
            className="w-full border p-2 rounded"
            name="contactPerson"
            placeholder="Contact Person"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />

          <input
            className="w-full border p-2 rounded"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            className="w-full border p-2 rounded"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            className="w-full border p-2 rounded"
            name="gstNumber"
            placeholder="GST Number"
            value={formData.gstNumber}
            onChange={handleChange}
          />

          <textarea
            className="w-full border p-2 rounded"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              {editing ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-gray-400 shrink-0" />

          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border rounded min-w-0"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-6 text-center">No clients found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">GST</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b">
                    <td className="p-3">{client.company}</td>
                    <td className="p-3">{client.contactPerson}</td>
                    <td className="p-3">{client.email}</td>
                    <td className="p-3">{client.phone}</td>
                    <td className="p-3">{client.gstNumber}</td>
                    <td className="p-3">
                      {client.active ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          console.log("Clicked delete", client.id);
                          handleDelete(client.id);
                        }}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";

interface Order {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  totalCost: number;
  status: string;
}

const EmployeeOrderPage: React.FC = () => {
  // Example Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "OD001",
      customerName: "John Doe",
      address: "123 Main St, New York, NY",
      phone: "+1-123-456-7890",
      email: "john@example.com",
      totalCost: 950,
      status: "Pending",
    },
    {
      id: "OD002",
      customerName: "Jane Smith",
      address: "456 Elm St, Los Angeles, CA",
      phone: "+1-321-654-0987",
      email: "jane@example.com",
      totalCost: 850,
      status: "Pending",
    },
    {
      id: "OD003",
      customerName: "Alice Johnson",
      address: "789 Pine St, Chicago, IL",
      phone: "+1-987-654-3210",
      email: "alice@example.com",
      totalCost: 650,
      status: "Pending",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleAcceptOrder = (id: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "Accepted" } : order
      )
    );
    setSelectedOrder(null); 
    alert(`Order ${id} has been accepted!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-6 text-center text-orange-600">
        Employee Order List
      </h1>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="border p-3 text-left">Order ID</th>
              <th className="border p-3 text-left">Customer Name</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="border p-3">{order.id}</td>
                <td className="border p-3">{order.customerName}</td>
                <td
                  className={`border p-3 font-semibold ${
                    order.status === "Accepted"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {order.status}
                </td>
                <td className="border p-3 text-center">
                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">
              Order Details
            </h2>
            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedOrder.customerName}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.email}
            </p>
            <p>
              <strong>Total Cost:</strong> ${selectedOrder.totalCost}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  selectedOrder.status === "Accepted"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {selectedOrder.status}
              </span>
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
              {selectedOrder.status !== "Accepted" && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  onClick={() => handleAcceptOrder(selectedOrder.id)}
                >
                  Accept Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeOrderPage;
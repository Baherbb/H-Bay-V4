import React, { useState, useEffect } from "react";
import { Users, Edit, Trash2, PlusCircle, X } from "lucide-react";
import axios from "axios";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  user_type: "employee";
}
const API_BASE_URL = "http://localhost:3000"; 


const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "update">("add");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formValues, setFormValues] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    password: "",
    user_type: "employee"
  });
  const [error, setError] = useState<string>("");

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/employees`, 
        getAuthHeader()
      );
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to fetch employees";
      setError(errorMsg);
      if (error.response?.status === 401) {
        console.log("Unauthorized access, please login again");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const openModal = (type: "add" | "update", employee?: Employee) => {
    setError("");
    setModalType(type);
    setIsModalOpen(true);

    if (type === "update" && employee) {
      setSelectedEmployee(employee);
      setFormValues({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        user_type: employee.user_type,
      });
    } else {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formValues.name || !formValues.email || !formValues.phone) {
        setError("Please fill in all required fields");
        return;
      }

      if (modalType === "add" && !formValues.password) {
        setError("Password is required for new employees");
        return;
      }

      if (modalType === "update" && selectedEmployee) {
        const updateData = { ...formValues };
        if (!updateData.password) delete updateData.password;

        const response = await axios.put(
          `${API_BASE_URL}/api/user/employees/${selectedEmployee.id}`,
          updateData,
          getAuthHeader()
        );
        if (response.data.success) {
          await fetchEmployees();
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/user/employees`, 
          formValues,
          getAuthHeader()
        );
        if (response.data.success) {
          await fetchEmployees();
        }
      }
      closeModal();
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const deleteEmployee = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/user/employees/${id}`,
          getAuthHeader()
        );
        if (response.data.success) {
          await fetchEmployees();
        }
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to delete employee");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setError("");
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      email: "",
      phone: "",
      password: "",
      user_type: "employee"
    });
    setSelectedEmployee(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Employee Management</h2>

      <button
        onClick={() => openModal("add")}
        className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Employee
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-xl font-medium mb-4 flex items-center">
          <Users className="h-6 w-6 text-gray-700 mr-2" />
          Employees
        </h3>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.email}</td>
                <td className="border p-2">{employee.phone}</td>
                <td className="border p-2">{employee.user_type}</td>
                <td className="border p-2 flex space-x-2 justify-center">
                  <button
                    onClick={() => openModal("update", employee)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">
                {modalType === "add" ? "Add Employee" : "Update Employee"}
              </h3>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formValues.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder={modalType === "add" ? "Password" : "New Password (optional)"}
                value={formValues.password || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required={modalType === "add"}
              />
              <select
                name="user_type"
                value={formValues.user_type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="employee">Employee</option>
              </select>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-orange-500 text-white px-4 py-2 rounded"
              >
                {modalType === "add" ? "Add Employee" : "Update Employee"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
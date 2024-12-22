import React, { useState, useEffect } from "react";
import { Edit, Trash2, PlusCircle, X } from "lucide-react";
import axios from "axios";

export interface Category {
  id: number;
  name: string;
  image_url?: string;
  description?: string;
  parent_category_id?: number;
  parent?: Category;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = "http://localhost:3000/api/categories"; 

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    image_url: "",
    description: "",
    parent_category_id: undefined,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setCategories(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    try {
      setLoading(true);
      await axios.post(API_BASE_URL, newCategory);
      await fetchCategories(); 
      setShowAddCategoryModal(false);
      setNewCategory({
        name: "",
        image_url: "",
        description: "",
        parent_category_id: undefined,
      });
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategory({
      ...category,
      image_url: category.image_url || "" 
    });
  };

  const deleteCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/${categoryId}`);
      await fetchCategories(); 
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async () => {
    if (!editingCategory) return;
    
    try {
      setLoading(true);
      const updateData = {
        name: editingCategory.name,
        description: editingCategory.description,
        parent_category_id: editingCategory.parent_category_id,
        image_url: editingCategory.image_url 
      };
      
      await axios.put(`${API_BASE_URL}/${editingCategory.id}`, updateData);
      await fetchCategories(); 
      setEditingCategory(null);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6 text-center">Categories</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowAddCategoryModal(true)}
        className="bg-orange-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2"
        disabled={loading}
      >
        <PlusCircle className="h-5 w-5" />
        Add Category
      </button>

      {loading && (
        <div className="text-center py-4">
          Loading...
        </div>
      )}

      <ul className="space-y-4">
        {categories.map((category) => (
        <li key={category.id} className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
        <div className="flex justify-between items-start mb-2">
          <div>
            <strong className="text-xl text-gray-800">{category.name}</strong>
            
            {/* Add image display here */}
            {category.image_url && (
              <div className="mt-2 mb-2">
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-32 h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = 'fallback-image-url.jpg'; // Add a fallback image URL
                    e.currentTarget.onerror = null; // Prevent infinite loop
                  }}
                />
              </div>
            )}
            
            <p className="text-gray-600">{category.description}</p>
            {category.parent && (
              <p className="text-sm text-gray-500">Parent: {category.parent.name}</p>
            )}
            {category.children && category.children.length > 0 && (
              <p className="text-sm text-gray-500">
                Subcategories: {category.children.map(child => child.name).join(", ")}
              </p>
            )}
            <small className="text-gray-500">Created: {new Date(category.created_at).toLocaleDateString()}</small>
            <small className="text-gray-500 ml-4">Updated: {new Date(category.updated_at).toLocaleDateString()}</small>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => editCategory(category)}
              className="text-yellow-500 hover:text-yellow-600"
              disabled={loading}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => deleteCategory(category.id)}
              className="text-red-500 hover:text-red-600"
              disabled={loading}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        </li>

        ))}
      </ul>

      {/* Modal for Editing Category */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-semibold mb-4">Edit Category</h3>
            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category Name"
              disabled={loading}
            />
            <textarea
              value={editingCategory.description || ""}
              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category Description"
              disabled={loading}
            />
            <input
              type="text"
              value={editingCategory.image_url}
              onChange={(e) => setEditingCategory({ 
                ...editingCategory,  
                image_url: e.target.value 
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category image"
              disabled={loading}
            />
            <select
              value={editingCategory.parent_category_id || ""}
              onChange={(e) => setEditingCategory({ 
                ...editingCategory, 
                parent_category_id: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              disabled={loading}
            >
              <option value="">No Parent Category</option>
              {categories
                .filter(cat => cat.id !== editingCategory.id)
                .map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              }
            </select>
            <div className="flex justify-between">
              <button
                onClick={saveCategory}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                disabled={loading}
              >
                Save
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-gray-500 hover:text-gray-600"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding New Category */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-semibold mb-4">Add New Category</h3>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category Name"
              disabled={loading}
            />
            <textarea
              value={newCategory.description || ""}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category Description"
              disabled={loading}
            />
            <input
              type="text"
              value={newCategory.image_url}
              onChange={(e) => setNewCategory({ ...newCategory, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category image"
              disabled={loading}
            />
            <select
              value={newCategory.parent_category_id || ""}
              onChange={(e) => setNewCategory({ 
                ...newCategory, 
                parent_category_id: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              disabled={loading}
            >
              <option value="">No Parent Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={addCategory}
                className="bg-orange-500 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                Add Category
              </button>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-gray-500 hover:text-gray-600"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
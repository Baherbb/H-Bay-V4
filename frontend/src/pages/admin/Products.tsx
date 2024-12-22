import React, { useState, useEffect, ChangeEvent } from "react";
import { Edit, Trash2, PlusCircle, X, Package, Image as ImageIcon } from "lucide-react";
import { 
    productService, 
    categoryService, 
    Brand, 
    Category, 
    Product, 
    ProductSpecification, 
    ProductVariant,
    ProductImage 
} from "../../services/api.service";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category_id: 0,
    brand_id: 0,
    model_number: "",
    tech_category: "",
    release_date: "",
    warranty_info: "",
    weight: 0,
    dimensions: "",
  });

  const [productImages, setProductImages] = useState<ProductImage[]>([{
    // id: 0,
    product_id: currentProductId || 0,
    image_url: "",
    is_primary: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }]);

  const [newSpecification, setNewSpecification] = useState<ProductSpecification>({
    product_id: currentProductId || 0, 
    processor: "",
    ram: "",
    storage: "",
    display_size: "",
    display_resolution: "",
    battery_capacity: "",
    operating_system: "",
    camera_specs: "",
    connectivity: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const [variants, setVariants] = useState<ProductVariant[]>([{
    product_id: currentProductId || 0,
    name: "", 
    sku: "",
    color: "",
    storage_capacity: "",
    ram_size: "",
    price: 0,
    stock_quantity: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse, brandResponse] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
          categoryService.getAllBrands()
        ]);

        setProducts(productsResponse.products);
        setCategories(categoriesResponse);
        setBrands(brandResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleSpecificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewSpecification(prev => ({
      ...prev, 
      [e.target.name]: e.target.value,
      updated_at: new Date().toISOString()
    }));
  };
  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newImages = [...productImages];
    if (e.target.name === 'image_url') {
        newImages[index] = {
            ...newImages[index],
            image_url: e.target.value
        };
    } else if (e.target.name === 'is_primary') {
        newImages.forEach((img, i) => {
            img.is_primary = i === index ? e.target.checked : false;
        });
    }
    setProductImages(newImages);
};



  const handleVariantChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: name.includes('price') || name.includes('stock_quantity') ? Number(value) : value,
      updated_at: new Date().toISOString()
    };
    setVariants(updatedVariants);
  };

  const addImage = () => {
      setProductImages([
          ...productImages,
          {
              image_url: '',
              is_primary: productImages.length === 0, 
              display_order: productImages.length + 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
          }
      ]);
  };

  const addVariant = () => {
    setVariants(prevVariants => [...prevVariants, {
      product_id: currentProductId || 0,
      name: "", 
      sku: "",
      color: "",
      storage_capacity: "",
      ram_size: "",
      price: 0,
      stock_quantity: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
  };

  const removeImage = (index: number) => {
    if (productImages.length > 1) {
      setProductImages(productImages.filter((_, i) => i !== index));
    }
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditing(true);
      setCurrentProductId(product.id);
      setNewProduct({
        ...product,
        price: Number(product.price),
        weight: Number(product.weight),
      });
      
      setProductImages(
        product.images?.length 
            ? product.images.map(img => ({
                id: img.id,
                product_id: product.id,
                variant_id: img.variant_id,
                image_url: img.image_url,
                is_primary: img.is_primary,
                display_order: img.display_order,
                created_at: img.created_at,
                updated_at: new Date().toISOString()
            }))
            : [{
                id: 0,
                product_id: product.id,
                variant_id: null,
                image_url: "",
                is_primary: true,
                display_order: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }]
    );

      setNewSpecification({
        id: product.specifications?.id || 0,
        product_id: product.id,
        processor: product.specifications?.processor || "",
        ram: product.specifications?.ram || "",
        storage: product.specifications?.storage || "",
        display_size: product.specifications?.display_size || "",
        display_resolution: product.specifications?.display_resolution || "",
        battery_capacity: product.specifications?.battery_capacity || "",
        operating_system: product.specifications?.operating_system || "",
        camera_specs: product.specifications?.camera_specs || "",
        connectivity: product.specifications?.connectivity || "",
        created_at: product.specifications?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      setVariants(product.variants?.length ? product.variants.map(variant => ({
        ...variant,
        price: Number(variant.price),
        updated_at: new Date().toISOString()
      })) : [{
        id: 0,
        product_id: product.id,
        name: product.name, 
        sku: "",
        color: "",
        storage_capacity: "",
        ram_size: "",
        price: 0,
        stock_quantity: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    } else {
      setEditing(false);
      setCurrentProductId(null);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category_id: 0,
        brand_id: 0,
        model_number: "",
        tech_category: "",
      });
      setNewSpecification({
        id: 0,
        product_id: 0,
        processor: "",
        ram: "",
        storage: "",
        display_size: "",
        display_resolution: "",
        battery_capacity: "",
        operating_system: "",
        camera_specs: "",
        connectivity: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setProductImages([{
        id: 0,
        product_id: 0,
        image_url: "",
        is_primary: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()

      }]);
      setVariants([{
        id: 0,
        product_id: 0,
        name: "", 
        sku: "",
        color: "",
        storage_capacity: "",
        ram_size: "",
        price: 0,
        stock_quantity: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);
      
      if (variants.length === 0) {
        throw new Error("At least one variant is required");
      }

      // Validate and prepare images
      const validatedImages = productImages
      .filter(img => img.image_url.trim()) // Only include images with URLs
      .map((img, index) => ({
          image_url: img.image_url,
          id: img.id,  // Include if it exists
          product_id: currentProductId || 0,
          variant_id: null as number | null,
          is_primary: img.is_primary || index === 0,
          display_order: index + 1,
          created_at: img.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
      }));

      if (validatedImages.length === 0) {
        throw new Error("At least one product image is required");
      }

      const validatedVariants = variants.map(variant => ({
        ...variant,
        name: variant.name || newProduct.name || "Default Variant",
        images: variant.images || []
      }));

      if (!newProduct.brand_id) {
        throw new Error("Please select a brand");
      }

      const productData: Product = {
        ...newProduct as Product,
        images: validatedImages,
        price: Number(newProduct.price || 0),
        weight: Number(newProduct.weight || 0),
        specifications: {
          ...newSpecification,
          id: undefined,
          product_id: currentProductId || 0
        },
        variants: validatedVariants,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        default_variant_id: 0,
        category_id: newProduct.category_id || 0,
        brand_id: Number(newProduct.brand_id) || 1
      } as Product;

      let savedProduct: Product;
      if (editing && currentProductId) {
          savedProduct = await productService.updateProduct(currentProductId, productData);
      } else {
          savedProduct = await productService.createProduct(productData);
      }

      // Refresh products list
      const updatedProductsResponse = await productService.getProducts();
      setProducts(updatedProductsResponse.products);
      
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      
      const updatedProductsResponse = await productService.getProducts();
      setProducts(updatedProductsResponse.products);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Product Management</h2>

      <div className="flex justify-between items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-1/4 p-2 border rounded"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id.toString()}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-xl font-medium mb-4 flex items-center">
          <Package className="h-6 w-6 text-gray-700 mr-2" />
          Products
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Image</th>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Brand</th>
                <th className="border p-2">Base Price</th>
                <th className="border p-2">Variants</th>
                <th className="border p-2">Specifications</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(product => selectedCategory === "all" || product.category_id.toString() === selectedCategory)
                .map((product) => (
                  <tr key={product.id}>
                                        <td className="border p-2">
                      {product.images?.find(img => img.is_primary)?.image_url ? (
                        <img 
                          src={product.images.find(img => img.is_primary)?.image_url} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="border p-2">{product.id}</td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">{product.category?.name}</td>
                    <td className="border p-2">{product.brand?.name}</td>
                    <td className="border p-2">${product.price}</td>
                    <td className="border p-2">
                      <details>
                        <summary>View Variants ({product.variants?.length || 0})</summary>
                        <div className="p-2">
                          {product.variants?.map((variant) => (
                            <div key={variant.id} className="mb-2">
                              <p>SKU: {variant.sku}</p>
                              <p>Color: {variant.color}</p>
                              <p>Storage: {variant.storage_capacity}</p>
                              <p>RAM: {variant.ram_size}</p>
                              <p>Price: ${variant.price}</p>
                              <p>Stock: {variant.stock_quantity}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    </td>
                    <td className="border p-2">
                      <details>
                        <summary>View Details</summary>
                        <div className="p-2">
                          <p>Processor: {product.specifications?.processor}</p>
                          <p>RAM: {product.specifications?.ram}</p>
                          <p>Storage: {product.specifications?.storage}</p>
                          <p>Display: {product.specifications?.display_size}</p>
                          <p>Resolution: {product.specifications?.display_resolution}</p>
                          <p>Battery: {product.specifications?.battery_capacity}</p>
                          <p>OS: {product.specifications?.operating_system}</p>
                        </div>
                      </details>
                    </td>
                    <td className="border p-2">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => openModal(product)}
                          className="text-yellow-400 hover:text-yellow-600"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">{editing ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Basic Information</h4>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                    <input
                    type="number"
                    name="price"
                    placeholder="Base Price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="date"
                    name="release_date"
                    value={newProduct.release_date}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="warranty_info"
                    placeholder="Warranty Information"
                    value={newProduct.warranty_info}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (g)"
                    value={newProduct.weight}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="dimensions"
                    placeholder="Dimensions (L x W x H)"
                    value={newProduct.dimensions}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                  />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="category_id"
                    value={newProduct.category_id}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="brand_id"
                    value={newProduct.brand_id}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                    </select>
                  <input
                    type="text"
                    name="model_number"
                    value={newProduct.model_number}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                    placeholder="Model Number"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">Product Images</h4>
                  <button
                    type="button"
                    onClick={addImage}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
                {productImages.map((image, index) => (
                  <div key={index} className="p-4 border rounded space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Image {index + 1}</h5>
                      {productImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="image_url"
                        placeholder="Image URL"
                        value={image.image_url}
                        onChange={(e) => handleImageChange(index, e)}
                        className="p-2 border rounded"
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_primary"
                          checked={image.is_primary}
                          onChange={(e) => handleImageChange(index, e)}
                          className="mr-2"
                        />
                        <label>Primary Image</label>
                      </div>
                    </div>
                    {image.image_url && (
                      <img
                        src={image.image_url}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Technical Specifications</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="processor"
                    placeholder="Processor"
                    value={newSpecification.processor}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="ram"
                    placeholder="RAM"
                    value={newSpecification.ram}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="storage"
                    placeholder="Storage"
                    value={newSpecification.storage}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="display_size"
                    placeholder="Display Size"
                    value={newSpecification.display_size}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="display_resolution"
                    placeholder="Display Resolution"
                    value={newSpecification.display_resolution}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="battery_capacity"
                    placeholder="Battery Capacity"
                    value={newSpecification.battery_capacity}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="operating_system"
                    placeholder="Operating System"
                    value={newSpecification.operating_system}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="camera_specs"
                    placeholder="Camera Specifications"
                    value={newSpecification.camera_specs}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="connectivity"
                    placeholder="Connectivity"
                    value={newSpecification.connectivity}
                    onChange={handleSpecificationChange}
                    className="p-2 border rounded"
                  />
                </div>
              </div>

              {/* Product Variants */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">Product Variants</h4>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
                {variants.map((variant, index) => (
                  <div key={index} className="p-4 border rounded space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Variant {index + 1}</h5>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="sku"
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="p-2 border rounded"
                      />
                      <input
                        type="text"
                        name="color"
                        placeholder="Color"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="p-2 border rounded"
                      />
                      <input
                        type="text"
                        name="storage_capacity"
                        placeholder="Storage Capacity"
                        value={variant.storage_capacity}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="p-2 border rounded"
                      />
                      <input
                        type="text"
                        name="ram_size"
                        placeholder="RAM Size"
                        value={variant.ram_size}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="p-2 border rounded"
                      />
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="p-2 border rounded"
                      />
                      <input
                        type="number"
                        name="stock_quantity"
                        placeholder="Stock Quantity"
                        value={variant.stock_quantity}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="p-2 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  {editing ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
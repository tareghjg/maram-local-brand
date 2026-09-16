import "./AdminProducts.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const API_URL = `${API_BASE_URL}/api/products`;
const UPLOAD_URL = `${API_BASE_URL}/api/upload`;

const DEFAULT_SIZES = ["2X", "3X"];

const emptyForm = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  price: "",
  category: "Isdal",
  available: true,
  sizes: ["2X", "3X"],
  colors: [],
};

function AdminProducts() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [viewingProduct, setViewingProduct] =
    useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [dragging, setDragging] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem(
      "maram-admin-authenticated"
    );
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [previewImages]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch products."
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );

      setError(
        "Something went wrong while loading products."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================
     SIZES
  ========================= */

  const toggleSize = (size) => {
    setForm((current) => {
      const currentSizes =
        current.sizes || [];

      const exists =
        currentSizes.includes(size);

      return {
        ...current,
        sizes: exists
          ? currentSizes.filter(
              (item) => item !== size
            )
          : [...currentSizes, size],
      };
    });
  };

  /* =========================
     COLORS
  ========================= */

  const addColor = () => {
    setForm((current) => ({
      ...current,
      colors: [
        ...(current.colors || []),
        {
          name: "",
          value: "#000000",
        },
      ],
    }));
  };

  const updateColor = (
    index,
    field,
    value
  ) => {
    setForm((current) => {
      const colors = [
        ...(current.colors || []),
      ];

      colors[index] = {
        ...colors[index],
        [field]: value,
      };

      return {
        ...current,
        colors,
      };
    });
  };

  const removeColor = (index) => {
    setForm((current) => ({
      ...current,
      colors: (
        current.colors || []
      ).filter(
        (_, colorIndex) =>
          colorIndex !== index
      ),
    }));
  };

  /* =========================
     IMAGES
  ========================= */

  const addFiles = (files) => {
    const incomingFiles =
      Array.from(files || []);

    if (incomingFiles.length === 0) {
      return;
    }

    const imageFiles =
      incomingFiles.filter((file) =>
        file.type.startsWith("image/")
      );

    if (
      imageFiles.length !==
      incomingFiles.length
    ) {
      setError(
        "Only image files are allowed."
      );
      return;
    }

    const validFiles =
      imageFiles.filter(
        (file) =>
          file.size <=
          10 * 1024 * 1024
      );

    if (
      validFiles.length !==
      imageFiles.length
    ) {
      setError(
        "Each image must be 10MB or smaller."
      );
    }

    const currentImageCount =
      uploadedImages.length +
      previewImages.length;

    const remainingSlots =
      10 - currentImageCount;

    if (remainingSlots <= 0) {
      setError(
        "You can upload a maximum of 10 images."
      );
      return;
    }

    const filesToAdd =
      validFiles.slice(
        0,
        remainingSlots
      );

    setSelectedFiles((current) => [
      ...current,
      ...filesToAdd,
    ]);

    const newPreviews =
      filesToAdd.map((file) => ({
        file,
        preview:
          URL.createObjectURL(file),
      }));

    setPreviewImages((current) => [
      ...current,
      ...newPreviews,
    ]);

    setError("");
    setSuccess("");
  };

  const handleFileChange = (
    event
  ) => {
    addFiles(event.target.files);

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    addFiles(
      event.dataTransfer.files
    );
  };

  const removeSelectedImage = (
    index
  ) => {
    setSelectedFiles((current) =>
      current.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );

    setPreviewImages((current) => {
      const image = current[index];

      if (image?.preview) {
        URL.revokeObjectURL(
          image.preview
        );
      }

      return current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );
    });
  };

  const removeUploadedImage = (
    index
  ) => {
    setUploadedImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  const moveUploadedImageToMain = (
    index
  ) => {
    if (index === 0) {
      return;
    }

    setUploadedImages((current) => {
      const images = [...current];

      const selectedImage =
        images[index];

      images.splice(index, 1);
      images.unshift(selectedImage);

      return images;
    });
  };

  const movePreviewImageToMain = (
    index
  ) => {
    if (uploadedImages.length > 0) {
      return;
    }

    if (index === 0) {
      return;
    }

    setSelectedFiles((current) => {
      const files = [...current];

      const selectedFile =
        files[index];

      files.splice(index, 1);
      files.unshift(selectedFile);

      return files;
    });

    setPreviewImages((current) => {
      const images = [...current];

      const selectedImage =
        images[index];

      images.splice(index, 1);
      images.unshift(selectedImage);

      return images;
    });
  };

  const clearImages = () => {
    previewImages.forEach((image) => {
      if (image.preview) {
        URL.revokeObjectURL(
          image.preview
        );
      }
    });

    setSelectedFiles([]);
    setPreviewImages([]);
    setUploadedImages([]);
  };

  /* =========================
     UPLOAD IMAGES
  ========================= */

  const prepareUploadFile = async (file) => {
    const maxUploadSize = 3.5 * 1024 * 1024;

    if (file.size <= maxUploadSize) {
      return file;
    }

    try {
      const image = await createImageBitmap(file);
      const maxDimension = 1600;
      const scale = Math.min(
        1,
        maxDimension / Math.max(image.width, image.height)
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");

      if (!context) {
        return file;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();

      const compressedBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.82);
      });

      if (!compressedBlob || compressedBlob.size > maxUploadSize) {
        return file;
      }

      return new File(
        [compressedBlob],
        `${file.name.replace(/\.[^/.]+$/, "")}.jpg`,
        { type: "image/jpeg" }
      );
    } catch (compressionError) {
      console.warn("Image compression skipped:", compressionError);
      return file;
    }
  };

  const uploadSingleImage = async (
    file
  ) => {
    const uploadFile = await prepareUploadFile(file);
    const formData = new FormData();

    formData.append(
      "images",
      uploadFile,
      uploadFile.name || "product-image.jpg"
    );

    let response;

    try {
      response = await fetch(
        UPLOAD_URL,
        {
          method: "POST",
          body: formData,
        }
      );
    } catch (networkError) {
      console.error(
        "Image upload network error:",
        networkError
      );

      throw new Error(
        "Could not connect to the image upload server. Please check your internet connection and try again."
      );
    }

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Image upload failed with status ${response.status}.`
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Image upload failed."
      );
    }

    if (
      !data.images ||
      !Array.isArray(data.images) ||
      data.images.length === 0
    ) {
      throw new Error(
        "The image server did not return an image URL."
      );
    }

    return data.images[0];
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      return [];
    }

    setUploading(true);
    setError("");

    try {
      const uploadedUrls = [];

      for (
        let index = 0;
        index < selectedFiles.length;
        index += 1
      ) {
        const file =
          selectedFiles[index];

        setSuccess(
          `Uploading image ${index + 1} of ${selectedFiles.length}...`
        );

        const imageUrl =
          await uploadSingleImage(
            file
          );

        uploadedUrls.push(imageUrl);
      }

      setSuccess(
        "Images uploaded successfully."
      );

      return uploadedUrls;
    } catch (error) {
      console.error(
        "Upload images error:",
        error
      );

      throw new Error(
        error.message ||
          "Something went wrong while uploading images."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     RESET
  ========================= */

  const resetForm = () => {
    clearImages();

    setForm({
      ...emptyForm,
      sizes: [...DEFAULT_SIZES],
      colors: [],
    });

    setEditingId(null);
    setError("");
    setSuccess("");
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.nameEn.trim() ||
      !form.nameAr.trim()
    ) {
      setError(
        "Please enter the product name in both languages."
      );
      return;
    }

    if (
      !form.price ||
      Number(form.price) < 0
    ) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    if (
      !form.sizes ||
      form.sizes.length === 0
    ) {
      setError(
        "Please select at least one size."
      );
      return;
    }

    const invalidColor =
      form.colors?.some(
        (color) =>
          !color.name.trim() ||
          !color.value
      );

    if (invalidColor) {
      setError(
        "Please complete all color information."
      );
      return;
    }

    if (
      uploadedImages.length === 0 &&
      selectedFiles.length === 0 &&
      !editingId
    ) {
      setError(
        "Please select at least one product image."
      );
      return;
    }

    try {
      setSaving(true);

      let imageUrls = [
        ...uploadedImages,
      ];

      if (selectedFiles.length > 0) {
        const newImages =
          await uploadImages();

        imageUrls = [
          ...imageUrls,
          ...newImages,
        ];
      }

      const uniqueImages = [
        ...new Set(imageUrls),
      ];

      if (
        uniqueImages.length === 0 &&
        !editingId
      ) {
        throw new Error(
          "Please upload at least one image."
        );
      }

      const productData = {
        name: {
          en: form.nameEn.trim(),
          ar: form.nameAr.trim(),
        },

        description: {
          en:
            form.descriptionEn.trim(),
          ar:
            form.descriptionAr.trim(),
        },

        price: Number(form.price),

        category: form.category,

        available: form.available,

        sizes: form.sizes,

        colors:
          form.colors || [],

        images: uniqueImages,

        image:
          uniqueImages[0] || "",
      };

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      let response;

      try {
        response = await fetch(
          url,
          {
            method: editingId
              ? "PATCH"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              productData
            ),
          }
        );
      } catch (networkError) {
        console.error(
          "Save product network error:",
          networkError
        );

        throw new Error(
          "Could not connect to the server while saving the product."
        );
      }

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          `Saving product failed with status ${response.status}.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save product."
        );
      }

      setSuccess(
        editingId
          ? "Product updated successfully."
          : "Product added successfully."
      );

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while saving the product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (
    product
  ) => {
    clearImages();

    const existingImages =
      product.images?.length
        ? product.images
        : product.image
        ? [product.image]
        : [];

    setUploadedImages(
      existingImages
    );

    setForm({
      nameEn:
        product.name?.en || "",

      nameAr:
        product.name?.ar || "",

      descriptionEn:
        product.description
          ?.en || "",

      descriptionAr:
        product.description
          ?.ar || "",

      price:
        product.price ?? "",

      category:
        product.category ||
        "Isdal",

      available:
        product.available !==
        false,

      sizes:
        product.sizes?.length
          ? product.sizes
          : [...DEFAULT_SIZES],

      colors:
        product.colors?.length
          ? product.colors.map(
              (color) => ({
                name:
                  color.name || "",
                value:
                  color.value ||
                  "#000000",
              })
            )
          : [],
    });

    setEditingId(
      product._id
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response =
        await fetch(
          `${API_URL}/${productId}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete product."
        );
      }

      if (
        editingId === productId
      ) {
        resetForm();
      }

      if (
        viewingProduct?._id ===
        productId
      ) {
        setViewingProduct(null);
      }

      setSuccess(
        "Product deleted successfully."
      );

      await fetchProducts();
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while deleting the product."
      );
    }
  };

  /* =========================
     HELPERS
  ========================= */

  const getProductImages = (
    product
  ) => {
    if (
      product.images &&
      product.images.length > 0
    ) {
      return product.images;
    }

    if (product.image) {
      return [product.image];
    }

    return [];
  };

  const openProductView = (
    product
  ) => {
    setViewingProduct(product);
  };

  const closeProductView = () => {
    setViewingProduct(null);
  };

  const filteredProducts =
    products.filter(
      (product) => {
        const searchText =
          search.toLowerCase();

        return (
          product.name?.en
            ?.toLowerCase()
            .includes(searchText) ||
          product.name?.ar
            ?.toLowerCase()
            .includes(searchText) ||
          product.category
            ?.toLowerCase()
            .includes(searchText)
        );
      }
    );

  return (
    <div className="admin-products-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>MARAM</span>
          <small>ADMIN</small>
        </div>

        <nav className="admin-nav">
          <a href="/admin/orders">
            <span>▣</span>
            Orders
          </a>

          <a
            href="/admin/products"
            className="active"
          >
            <span>◈</span>
            Products
          </a>

          <a href="#">
            <span>⌂</span>
            Shipping
          </a>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <span>↩</span>
            Logout
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <span>
            Admin Dashboard
          </span>
        </div>
      </aside>

      <main className="admin-products-main">
        <div className="admin-products-header">
          <div>
            <span className="admin-eyebrow">
              MARAM ADMIN
            </span>

            <h1>
              {editingId
                ? "Edit Product"
                : "Products"}
            </h1>

            <p>
              Manage your MARAM
              product collection.
            </p>
          </div>

          <div className="admin-header-actions">
            <a
              href="/shop"
              target="_blank"
              rel="noreferrer"
              className="view-store-btn"
            >
              View Store ↗
            </a>
          </div>
        </div>

        {(error || success) && (
          <div
            className={`admin-message ${
              error
                ? "error"
                : "success"
            }`}
          >
            {error || success}
          </div>
        )}

        <section className="product-form-card">
          <div className="section-heading">
            <div>
              <span>
                {editingId
                  ? "PRODUCT EDITOR"
                  : "NEW PRODUCT"}
              </span>

              <h2>
                {editingId
                  ? "Edit product"
                  : "Add a product"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={
                  resetForm
                }
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <div className="product-form-grid">
              <div className="form-column">
                <div className="form-group">
                  <label>
                    Product Name —
                    English
                  </label>

                  <input
                    type="text"
                    name="nameEn"
                    value={
                      form.nameEn
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Example: MARAM Silk Isdal"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Product Name —
                    Arabic
                  </label>

                  <input
                    type="text"
                    name="nameAr"
                    value={
                      form.nameAr
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="مثال: إسدال مرام الحريري"
                    dir="rtl"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Description —
                    English
                  </label>

                  <textarea
                    name="descriptionEn"
                    value={
                      form.descriptionEn
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Product description..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Description —
                    Arabic
                  </label>

                  <textarea
                    name="descriptionAr"
                    value={
                      form.descriptionAr
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="وصف المنتج..."
                    rows="4"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Price — EGP
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={
                        form.price
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Category
                    </label>

                    <select
                      name="category"
                      value={
                        form.category
                      }
                      onChange={
                        handleInputChange
                      }
                    >
                      <option value="Isdal">
                        Isdal
                      </option>

                      <option value="Abayas">
                        Abayas
                      </option>

                      <option value="Sets">
                        Sets
                      </option>

                      <option value="Accessories">
                        Accessories
                      </option>
                    </select>
                  </div>
                </div>

                <div className="availability-row">
                  <div>
                    <strong>
                      Product availability
                    </strong>

                    <span>
                      Make this
                      product visible
                      in the store.
                    </span>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      name="available"
                      checked={
                        form.available
                      }
                      onChange={
                        handleInputChange
                      }
                    />

                    <span className="slider"></span>
                  </label>
                </div>

                <div className="variant-section">
                  <div className="variant-section-heading">
                    <div>
                      <span>
                        PRODUCT SIZES
                      </span>

                      <h3>
                        Available sizes
                      </h3>

                      <p>
                        Select the sizes
                        customers can
                        order.
                      </p>
                    </div>
                  </div>

                  <div className="size-admin-options">
                    {DEFAULT_SIZES.map(
                      (size) => (
                        <button
                          type="button"
                          key={size}
                          className={`size-admin-option ${
                            form.sizes?.includes(
                              size
                            )
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            toggleSize(
                              size
                            )
                          }
                        >
                          {size}

                          {form.sizes?.includes(
                            size
                          ) && (
                            <span>
                              ✓
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="variant-section">
                  <div className="variant-section-heading">
                    <div>
                      <span>
                        PRODUCT COLORS
                      </span>

                      <h3>
                        Available colors
                      </h3>

                      <p>
                        Add the colors
                        available for
                        this product.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="add-color-btn"
                      onClick={
                        addColor
                      }
                    >
                      + Add Color
                    </button>
                  </div>

                  {form.colors?.length ===
                  0 ? (
                    <div className="no-colors">
                      <span>
                        No colors added
                        yet.
                      </span>

                      <small>
                        Add at least one
                        color if the
                        product has
                        color options.
                      </small>
                    </div>
                  ) : (
                    <div className="admin-colors-list">
                      {form.colors.map(
                        (
                          color,
                          index
                        ) => (
                          <div
                            className="admin-color-row"
                            key={`color-${index}`}
                          >
                            <div
                              className="admin-color-preview"
                              style={{
                                backgroundColor:
                                  color.value ||
                                  "#000000",
                              }}
                            ></div>

                            <div className="admin-color-name">
                              <label>
                                Color Name
                              </label>

                              <input
                                type="text"
                                value={
                                  color.name
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateColor(
                                    index,
                                    "name",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                placeholder="Black"
                              />
                            </div>

                            <div className="admin-color-picker">
                              <label>
                                Color
                              </label>

                              <input
                                type="color"
                                value={
                                  color.value ||
                                  "#000000"
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateColor(
                                    index,
                                    "value",
                                    event
                                      .target
                                      .value
                                  )
                                }
                              />
                            </div>

                            <button
                              type="button"
                              className="remove-color-btn"
                              onClick={() =>
                                removeColor(
                                  index
                                )
                              }
                              title="Remove color"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="image-upload-section">
              <div className="image-section-heading">
                <div>
                  <span>
                    PRODUCT IMAGES
                  </span>

                  <h3>
                    Upload product
                    photos
                  </h3>

                  <p>
                    Add up to 10
                    images. The first
                    image will be the
                    main cover.
                  </p>
                </div>

                <div className="image-counter">
                  {previewImages.length +
                    uploadedImages.length}
                  /10
                </div>
              </div>

              <div
                className={`upload-dropzone ${
                  dragging
                    ? "dragging"
                    : ""
                }`}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onDragOver={(
                  event
                ) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() =>
                  setDragging(false)
                }
                onDrop={
                  handleDrop
                }
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    handleFileChange
                  }
                  hidden
                />

                <div className="upload-icon">
                  ↑
                </div>

                <strong>
                  {uploading
                    ? "Uploading images..."
                    : "Drop your images here"}
                </strong>

                <span>
                  or click to browse
                  from your computer
                </span>

                <small>
                  JPG, PNG, WEBP • Max
                  10MB each • Up to 10
                  images
                </small>
              </div>

              {(previewImages.length >
                0 ||
                uploadedImages.length >
                  0) && (
                <div className="images-preview-grid">
                  {uploadedImages.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        className={`image-preview-card ${
                          index === 0
                            ? "main-image"
                            : ""
                        }`}
                        key={`uploaded-${image}-${index}`}
                      >
                        <img
                          src={image}
                          alt={`Product ${
                            index + 1
                          }`}
                        />

                        {index ===
                          0 && (
                          <span className="cover-badge">
                            Main Image
                          </span>
                        )}

                        <button
                          type="button"
                          className="main-image-btn"
                          onClick={() =>
                            moveUploadedImageToMain(
                              index
                            )
                          }
                          title="Set as main image"
                        >
                          ★
                        </button>

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() =>
                            removeUploadedImage(
                              index
                            )
                          }
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}

                  {previewImages.map(
                    (
                      image,
                      index
                    ) => {
                      const imageNumber =
                        uploadedImages.length +
                        index;

                      return (
                        <div
                          className={`image-preview-card ${
                            imageNumber ===
                            0
                              ? "main-image"
                              : ""
                          }`}
                          key={`preview-${image.preview}`}
                        >
                          <img
                            src={
                              image.preview
                            }
                            alt={`Selected ${
                              imageNumber +
                              1
                            }`}
                          />

                          {imageNumber ===
                            0 && (
                            <span className="cover-badge">
                              Main Image
                            </span>
                          )}

                          {uploadedImages.length ===
                            0 && (
                            <button
                              type="button"
                              className="main-image-btn"
                              onClick={() =>
                                movePreviewImageToMain(
                                  index
                                )
                              }
                              title="Set as main image"
                            >
                              ★
                            </button>
                          )}

                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() =>
                              removeSelectedImage(
                                index
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="save-product-btn"
                disabled={
                  saving ||
                  uploading
                }
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-form-btn"
                  onClick={
                    resetForm
                  }
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="products-list-section">
          <div className="products-list-header">
            <div>
              <span>
                PRODUCT CATALOG
              </span>

              <h2>
                All Products
              </h2>
            </div>

            <div className="products-search">
              <span>⌕</span>

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products..."
              />
            </div>
          </div>

          {loading ? (
            <div className="products-empty">
              Loading products...
            </div>
          ) : filteredProducts.length ===
            0 ? (
            <div className="products-empty">
              <strong>
                No products found
              </strong>

              <span>
                Add your first product
                using the form above.
              </span>
            </div>
          ) : (
            <div className="products-table">
              <div className="products-table-head">
                <span>
                  PRODUCT
                </span>

                <span>
                  CATEGORY
                </span>

                <span>
                  PRICE
                </span>

                <span>
                  IMAGES
                </span>

                <span>
                  STATUS
                </span>

                <span>
                  ACTIONS
                </span>
              </div>

              {filteredProducts.map(
                (product) => {
                  const images =
                    getProductImages(
                      product
                    );

                  return (
                    <div
                      className="product-table-row"
                      key={
                        product._id
                      }
                    >
                      <div className="product-table-product">
                        <img
                          src={
                            images[0]
                          }
                          alt={
                            product
                              .name
                              ?.en
                          }
                        />

                        <div>
                          <strong>
                            {
                              product
                                .name
                                ?.en
                            }
                          </strong>

                          <span>
                            {
                              product
                                .name
                                ?.ar
                            }
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="category-badge">
                          {
                            product.category
                          }
                        </span>
                      </div>

                      <div className="product-price">
                        {
                          product.price
                        }{" "}
                        EGP
                      </div>

                      <div className="image-count">
                        <span>
                          ◫
                        </span>

                        {
                          images.length
                        }
                      </div>

                      <div>
                        <span
                          className={`status-badge ${
                            product.available
                              ? "available"
                              : "unavailable"
                          }`}
                        >
                          {product.available
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>

                      <div className="product-actions">
                        <button
                          type="button"
                          className="view-action"
                          onClick={() =>
                            openProductView(
                              product
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              product
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-action"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>

      {viewingProduct && (
        <div
          className="product-view-overlay"
          onClick={
            closeProductView
          }
        >
          <div
            className="product-view-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="product-view-close"
              onClick={
                closeProductView
              }
            >
              ×
            </button>

            <div className="product-view-header">
              <span>
                PRODUCT DETAILS
              </span>

              <h2>
                {
                  viewingProduct
                    .name?.en
                }
              </h2>

              <p dir="rtl">
                {
                  viewingProduct
                    .name?.ar
                }
              </p>
            </div>

            <div className="product-view-content">
              <div className="product-view-images">
                {getProductImages(
                  viewingProduct
                ).map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      className={`product-view-image ${
                        index === 0
                          ? "main-view-image"
                          : ""
                      }`}
                      key={`${image}-${index}`}
                    >
                      <img
                        src={image}
                        alt={`Product ${
                          index + 1
                        }`}
                      />

                      {index ===
                        0 && (
                        <span>
                          Main Image
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="product-view-info">
                <div className="product-view-price">
                  {
                    viewingProduct.price
                  }{" "}
                  EGP
                </div>

                <div className="product-view-status">
                  <span
                    className={`status-badge ${
                      viewingProduct.available
                        ? "available"
                        : "unavailable"
                    }`}
                  >
                    {viewingProduct.available
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                <div className="product-view-field">
                  <span>
                    Category
                  </span>

                  <strong>
                    {
                      viewingProduct.category
                    }
                  </strong>
                </div>

                <div className="product-view-field">
                  <span>
                    Available Sizes
                  </span>

                  <div className="product-view-sizes">
                    {viewingProduct
                      .sizes
                      ?.length ? (
                      viewingProduct.sizes.map(
                        (size) => (
                          <span
                            key={size}
                          >
                            {size}
                          </span>
                        )
                      )
                    ) : (
                      <span>
                        2X
                      </span>
                    )}
                  </div>
                </div>

                <div className="product-view-field">
                  <span>
                    Available Colors
                  </span>

                  {viewingProduct
                    .colors
                    ?.length ? (
                    <div className="product-view-colors">
                      {viewingProduct.colors.map(
                        (
                          color,
                          index
                        ) => (
                          <div
                            className="product-view-color"
                            key={`${color.name}-${index}`}
                          >
                            <span
                              className="product-view-color-dot"
                              style={{
                                backgroundColor:
                                  color.value,
                              }}
                            ></span>

                            <span>
                              {
                                color.name
                              }
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p>
                      No colors
                      added.
                    </p>
                  )}
                </div>

                <div className="product-view-field">
                  <span>
                    Description —
                    English
                  </span>

                  <p>
                    {viewingProduct
                      .description
                      ?.en ||
                      "No description added."}
                  </p>
                </div>

                <div className="product-view-field">
                  <span>
                    Description —
                    Arabic
                  </span>

                  <p dir="rtl">
                    {viewingProduct
                      .description
                      ?.ar ||
                      "لا يوجد وصف مضاف."}
                  </p>
                </div>

                <div className="product-view-actions">
                  <button
                    type="button"
                    className="edit-view-btn"
                    onClick={() => {
                      closeProductView();

                      handleEdit(
                        viewingProduct
                      );
                    }}
                  >
                    Edit Product
                  </button>

                  <button
                    type="button"
                    className="delete-view-btn"
                    onClick={() =>
                      handleDelete(
                        viewingProduct._id
                      )
                    }
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
import React, { useState } from "react";
import { addSupplierItem } from "../services/supplierService";

export default function AddSupplierItemForm({ onSuccess }) {
  const [fields, setFields] = useState({
    itemName: "",
    quantityAvailable: "",
    unit: "kg",
    pricePerUnit: "",
    deliveryAvailable: false,
    deliveryFee: "",
    location: { lat: "", lng: "", address: "" },
    type: "raw",
    category: "vegetables",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([k, v]) => formData.append(`${key}[${k}]`, v));
        } else {
          formData.append(key, value);
        }
      });
      images.forEach((img) => formData.append("images", img));
      await addSupplierItem(formData);
      setFields({ ...fields, itemName: "", description: "" });
      setImages([]);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="itemName" value={fields.itemName} onChange={handleChange} placeholder="Item Name" required />
      <input name="quantityAvailable" value={fields.quantityAvailable} onChange={handleChange} placeholder="Quantity" type="number" required />
      <input name="pricePerUnit" value={fields.pricePerUnit} onChange={handleChange} placeholder="Price per unit" type="number" required />
      <input name="unit" value={fields.unit} onChange={handleChange} placeholder="Unit" required />
      <input name="deliveryFee" value={fields.deliveryFee} onChange={handleChange} placeholder="Delivery Fee" type="number" />
      <input name="location[address]" value={fields.location.address} onChange={e => setFields(f => ({...f, location: {...f.location, address: e.target.value}}))} placeholder="Address" required />
      <input name="location[lat]" value={fields.location.lat} onChange={e => setFields(f => ({...f, location: {...f.location, lat: e.target.value}}))} placeholder="Latitude" required />
      <input name="location[lng]" value={fields.location.lng} onChange={e => setFields(f => ({...f, location: {...f.location, lng: e.target.value}}))} placeholder="Longitude" required />
      <select name="type" value={fields.type} onChange={handleChange}>
        <option value="raw">Raw</option>
        <option value="half-baked">Half-baked</option>
        <option value="complete">Complete</option>
      </select>
      <select name="category" value={fields.category} onChange={handleChange}>
        <option value="vegetables">Vegetables</option>
        <option value="fruits">Fruits</option>
        <option value="spices">Spices</option>
        <option value="sauces">Sauces</option>
        <option value="containers">Containers</option>
        <option value="grains">Grains</option>
        <option value="dairy">Dairy</option>
        <option value="meat">Meat</option>
        <option value="other">Other</option>
      </select>
      <textarea name="description" value={fields.description} onChange={handleChange} placeholder="Description" />
      <input type="file" multiple accept="image/*" onChange={handleImageChange} required />
      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Item"}</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}

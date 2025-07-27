import React, { useState } from 'react';
import { addSupplierItem } from '../services/supplierService';
import useAuth from '../hooks/useAuth';
import { X, Upload, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const AddNewListingModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    type: '',
    imageUrl: [],
    quantityAvailable: '',
    unit: '',
    pricePerUnit: '',
    deliveryAvailable: false,
    deliveryFee: '',
    location: {
      address: '',
      lat: '',
      lng: ''
    }
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'spices', label: 'Spices' },
    { value: 'sauces', label: 'Sauces' },
    { value: 'containers', label: 'Containers' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'other', label: 'Other' }
  ];

  const types = [
    { value: 'raw', label: 'Raw' },
    { value: 'half-baked', label: 'Half-baked' },
    { value: 'complete', label: 'Complete' }
  ];

  const units = [
    { value: 'kg', label: 'Kg' },
    { value: 'liters', label: 'Liters' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'grams', label: 'Grams' },
    { value: 'ml', label: 'ML' },
    { value: 'dozens', label: 'Dozens' },
    { value: 'packets', label: 'Packets' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPreview = {
          id: Date.now() + Math.random(),
          url: event.target.result
        };
        setImagePreviews(prev => [...prev, newPreview]);
        setFormData(prev => ({
          ...prev,
          imageUrl: [...prev.imageUrl, file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    // Find the index in imagePreviews
    const idx = imagePreviews.findIndex(img => img.id === id);
    setImagePreviews(prev => prev.filter((img, i) => i !== idx));
    setFormData(prev => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== idx)
    }));
  };

  const isStep1Valid = () => {
    return formData.itemName.trim() && formData.category && formData.type;
  };

  const isStep2Valid = () => {
    return formData.quantityAvailable && formData.unit && formData.pricePerUnit;
  };

  const isStep3Valid = () => {
    return (
      formData.location.address.trim() &&
      formData.location.lat !== '' &&
      formData.location.lng !== ''
    );
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Extra validation for all required fields
    if (
      !formData.itemName.trim() ||
      !formData.category ||
      !formData.type ||
      !formData.unit ||
      !formData.quantityAvailable || isNaN(Number(formData.quantityAvailable)) || Number(formData.quantityAvailable) <= 0 ||
      !formData.pricePerUnit || isNaN(Number(formData.pricePerUnit)) || Number(formData.pricePerUnit) < 0 ||
      !formData.location.address.trim() ||
      formData.location.lat === '' || isNaN(Number(formData.location.lat)) ||
      formData.location.lng === '' || isNaN(Number(formData.location.lng))
    ) {
      alert('Please fill all required fields with valid values.');
      return;
    }
    if (imagePreviews.length < 4) {
      alert('Please upload at least 4 images.');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('itemName', formData.itemName);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('type', formData.type);
      data.append('quantityAvailable', Number(formData.quantityAvailable));
      data.append('unit', formData.unit);
      data.append('pricePerUnit', Number(formData.pricePerUnit));
      data.append('deliveryAvailable', formData.deliveryAvailable ? 'true' : 'false');
      data.append('deliveryFee', Number(formData.deliveryFee) || 0);
      // Add location as JSON string (backend expects object)
      data.append('location', JSON.stringify({
        address: formData.location.address,
        lat: Number(formData.location.lat),
        lng: Number(formData.location.lng)
      }));
      // Append images as 'images'
      formData.imageUrl.forEach((file) => {
        if (file instanceof File) {
          data.append('images', file);
        }
      });
      // Call backend
      await addSupplierItem(data);
      alert('Listing added successfully!');
      onClose();
      // Reset form
      setCurrentStep(1);
      setFormData({
        itemName: '',
        description: '',
        category: '',
        type: '',
        imageUrl: [],
        quantityAvailable: '',
        unit: '',
        pricePerUnit: '',
        deliveryAvailable: false,
        deliveryFee: '',
        location: {
          address: '',
          lat: '',
          lng: ''
        }
      });
      setImagePreviews([]);
    } catch (err) {
      alert(
        err?.response?.data?.message || 'Failed to add listing. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Listing</h2>
            <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep ? 'bg-orange-400 text-white' :
                  step === currentStep ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 rounded-full ${
                    step < currentStep ? 'bg-orange-400' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
          <div className="px-6 pb-6">
            {/* Step 1: Basic Product Info */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Product Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                    >
                      <option value="">Select type</option>
                      {types.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Images + Quantity */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Images & Pricing</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images (Max 5)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload images</span>
                    </label>
                  </div>
                  
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {imagePreviews.map((preview) => (
                        <div key={preview.id} className="relative">
                          <img
                            src={preview.url}
                            alt="Preview"
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(preview.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity Available *
                    </label>
                    <input
                      type="number"
                      value={formData.quantityAvailable}
                      onChange={(e) => handleInputChange('quantityAvailable', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                    >
                      <option value="">Select unit</option>
                      {units.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Unit *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={formData.pricePerUnit}
                      onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Delivery & Address */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery & Location</h3>
                
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.deliveryAvailable}
                      onChange={(e) => handleInputChange('deliveryAvailable', e.target.checked)}
                      className="w-4 h-4 text-orange-400 border-gray-300 rounded focus:ring-orange-400"
                    />
                    <span className="text-sm font-medium text-gray-700">Delivery Available</span>
                  </label>
                </div>

                {formData.deliveryAvailable && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={formData.deliveryFee}
                        onChange={(e) => handleInputChange('deliveryFee', e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Address *
                  </label>
                  <textarea
                    value={formData.location.address}
                    onChange={(e) => handleInputChange('location.address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter your pickup address..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      value={formData.location.lat}
                      onChange={(e) => handleInputChange('location.lat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Enter latitude"
                      required
                      step="any"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      value={formData.location.lng}
                      onChange={(e) => handleInputChange('location.lng', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Enter longitude"
                      required
                      step="any"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}
              
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid())
                  }
                  className="flex items-center space-x-2 px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isStep3Valid() || loading}
                    className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Submitting...' : 'Submit Listing'}
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to show the modal and a sample card
import { useNavigate } from 'react-router-dom';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Example card data
  const demoItem = {
    id: 1,
    name: 'Sample Product',
    image: '/potato.jpg',
    description: 'Premium quality potatoes perfect for all your cooking needs',
    price: '₹25/kg',
    // available: true, // removed
    // quantityAvailable: 10, // removed
    category: 'Vegetables'
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen py-8">
      <div className="text-center mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium"
        >
          + Add New Listing
        </button>
      </div>

      {/* Demo Card (matches AllItemsPage/RawItemsSection style) */}
      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full max-w-xs mb-8">
        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
            {demoItem.category}
          </span>
        </div>
        {/* Floating Price Tag */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-black text-white px-4 py-2 rounded-lg font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            {demoItem.price}
          </div>
        </div>
        {/* Image Container with Gradient Overlay */}
        <div className="relative h-56 rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <img
            src={demoItem.image}
            alt={demoItem.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        {/* Content Container */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
            {demoItem.name}
          </h3>
          <p className="text-black text-sm leading-relaxed mb-6">
            {demoItem.description}
          </p>
          {/* Action Button: Place Order */}
          <div className="flex gap-3">
            <button
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/productdetail', { state: { item: demoItem } })}
            >
              Place Order
            </button>
          </div>
        </div>
        {/* Stock Status Indicator and available quantity removed */}
      </div>

      <AddNewListingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
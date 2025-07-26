import React, { useState } from 'react';
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
      address: ''
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
          url: event.target.result,
          file: file
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
    setImagePreviews(prev => prev.filter(img => img.id !== id));
    setFormData(prev => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, index) => index !== imagePreviews.findIndex(img => img.id === id))
    }));
  };

  const isStep1Valid = () => {
    return formData.itemName.trim() && formData.category && formData.type;
  };

  const isStep2Valid = () => {
    return formData.quantityAvailable && formData.unit && formData.pricePerUnit;
  };

  const isStep3Valid = () => {
    return formData.location.address.trim();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
        address: ''
      }
    });
    setImagePreviews([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                {/* Hero Section with Icon */}
                <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                  <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tell us about your product</h3>
                  <p className="text-gray-600 text-sm">Help buyers discover your listing with detailed information</p>
                </div>

                {/* Product Name with Icon */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="e.g., Fresh Organic Tomatoes"
                    required
                  />
                  {formData.itemName && (
                    <div className="mt-2 flex items-center text-green-600 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Good! Name looks great
                    </div>
                  )}
                </div>

                {/* Description with Icon */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Description
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                    placeholder="Tell buyers about quality, origin, freshness, or special features..."
                  />
                  <div className="mt-1 text-xs text-gray-500 flex justify-between">
                    <span>💡 Tip: Mention quality, freshness, or special features</span>
                    <span>{formData.description.length}/500</span>
                  </div>
                </div>

                {/* Category and Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none bg-white"
                      required
                    >
                      <option value="">Choose category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label === 'Vegetables' ? '🥬 ' : 
                           cat.label === 'Fruits' ? '🍎 ' :
                           cat.label === 'Spices' ? '🌶️ ' :
                           cat.label === 'Dairy' ? '🥛 ' :
                           cat.label === 'Grains' ? '🌾 ' :
                           cat.label === 'Meat' ? '🥩 ' : '📦 '}
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {formData.category && (
                      <div className="mt-2 text-xs text-gray-600 bg-orange-50 px-3 py-2 rounded-lg">
                        ✨ Great choice! {categories.find(c => c.value === formData.category)?.label} is popular
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Product Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none bg-white"
                      required
                    >
                      <option value="">Select type</option>
                      {types.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label === 'Raw' ? '🌱 ' : 
                           type.label === 'Half-baked' ? '⚡ ' : '✅ '}
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {formData.type && (
                      <div className="mt-2 text-xs text-gray-600">
                        {formData.type === 'raw' && '🌱 Perfect for cooking from scratch'}
                        {formData.type === 'half-baked' && '⚡ Quick preparation needed'}
                        {formData.type === 'complete' && '✅ Ready to use immediately'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-orange-600 font-medium">
                      {isStep1Valid() ? 'Complete ✅' : `${Object.values({itemName: formData.itemName, category: formData.category, type: formData.type}).filter(v => v).length}/3 fields`}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{width: `${(Object.values({itemName: formData.itemName, category: formData.category, type: formData.type}).filter(v => v).length / 3) * 100}%`}}
                    />
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
                  disabled={!isStep3Valid()}
                  className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Listing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to show the modal
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="text-center">

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-orange-400 text-white hover:text-orange-400 rounded-lg hover:bg-white transition-colors font-medium"
        >
          + Add New Listing
        </button>
      </div>

      <AddNewListingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
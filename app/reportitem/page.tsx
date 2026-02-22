// this page is where people will report a lost item they have found
"use client";

import { useState, useEffect } from 'react';

export default function ReportItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    lat: 0,
    long: 0,
    picture: null as File | null,
    phone: '',
    email: '',
  });

  const [locationError, setLocationError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const availableTags = [
    'electronics',
    'clothing',
    'accessories',
    'books',
    'keys',
    'bags',
    'jewelry',
    'wallet',
    'phone',
    'laptop',
    'water bottle',
    'umbrella',
    'other',
  ];

  // Get user's current location
  const getLocation = () => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        setLocationError('Unable to get your location. Please try again.');
        setLocationLoading(false);
        console.error(error);
      }
    );
  };

  const handleTagToggle = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((t) => t !== tag),
      });
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        picture: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || formData.tags.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.lat === 0 || formData.long === 0) {
      alert('Please get your current location');
      return;
    }

    if (!formData.picture) {
      alert('Please upload a picture of the item');
      return;
    }

    if (!formData.phone && !formData.email) {
      alert('Please provide at least one contact method (phone or email)');
      return;
    }

    // TODO: Send data to backend
    console.log('Form submitted:', formData);
    alert('Item reported successfully!');
  };

  return (
    <div className="min-h-full bg-light-beige p-6 mt-22">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-dark-navy mb-6">
          Report Found Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-dark-navy mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy focus:border-transparent"
              placeholder="e.g., Blue Backpack"
              required
            />
          </div>

          {/* Item Description */}
          <div>
            <label className="block text-sm font-medium text-dark-navy mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy focus:border-transparent"
              placeholder="Describe the item in detail..."
              rows={4}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-dark-navy mb-2">
              Tags * (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.tags.includes(tag)
                      ? 'bg-dark-navy text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-dark-navy mb-2">
              Location Found *
            </label>
            <button
              type="button"
              onClick={getLocation}
              disabled={locationLoading}
              className="w-full px-4 py-2 bg-dark-navy text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {locationLoading ? 'Getting location...' : 'Get Current Location'}
            </button>
            {formData.lat !== 0 && formData.long !== 0 && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Location captured: {formData.lat.toFixed(6)}, {formData.long.toFixed(6)}
              </p>
            )}
            {locationError && (
              <p className="mt-2 text-sm text-red-600">{locationError}</p>
            )}
          </div>

          {/* Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-dark-navy mb-2">
              Picture of Item *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy focus:border-transparent"
              required
            />
            {formData.picture && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {formData.picture.name}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-dark-navy">
              Contact Information (At least one required)
            </label>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy focus:border-transparent"
                placeholder="(123) 456-7890"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy focus:border-transparent"
                placeholder="your.email@tufts.edu"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-dark-navy text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Submit Found Item
          </button>
        </form>
      </div>
    </div>
  );
}
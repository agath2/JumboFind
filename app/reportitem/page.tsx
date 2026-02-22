"use client";

import { useState } from 'react';
import { analyzeImage } from '../actions/analyzeImage';

export default function ReportItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [] as string[], 
    location: '',         
    lat: 0,               
    long: 0,              
    picture: null as File | null,
    phone: '',            
    email: '',            
  });

  const [locationError, setLocationError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const availableTags = [
    'electronics', 'clothing', 'accessories', 'books', 'keys',
    'bags', 'jewelry', 'wallet', 'phone', 'laptop', 'water bottle', 'umbrella', 'other',
  ];

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
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          long: position.coords.longitude,
        }));
        setLocationLoading(false);
      },
      (error) => {
        setLocationError('Please allow location access in your browser to submit.');
        setLocationLoading(false);
        console.error(error);
      }
    );
  };

  const handleTagToggle = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, picture: e.target.files[0] });
    }
  };

  const handleAIAnalyze = async () => {
    if (!formData.picture) {
      alert("Please upload a picture first!");
      return;
    }

    setIsAnalyzing(true);
    
    if (formData.lat === 0) {
      getLocation();
    }

    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(formData.picture as File);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
      
      const aiResult = await analyzeImage(base64Image);
      
      if (aiResult) {
        setFormData(prev => ({
          ...prev,
          name: aiResult.title || prev.name,
          description: aiResult.description || prev.description,
        }));
      } else {
        alert("The AI couldn't read the image, but you can still type the details manually.");
      }
    } catch (error) {
      console.error("Pipeline error:", error);
      alert("AI pipeline failed. Check console.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.lat === 0 || formData.long === 0) {
      alert('Mandatory: We need the exact GPS location to accept this item. Please click "Drop GPS Pin" or the AI button and allow browser permissions.');
      return;
    }

    if (!formData.name || !formData.description || formData.tags.length === 0 || !formData.location) {
      alert('Please fill in all required fields (Name, Description, Tags, and Campus Zone)'); 
      return;
    }
    
    if (!formData.phone && !formData.email) {
      alert('Please provide at least one contact method (phone or email)');
      return;
    }

    console.log('Form submitted:', formData);
    alert('Item reported successfully!');
  };

  return (
    <div className="min-h-screen bg-light-beige p-6 font-body text-dark-navy">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6">
          Report Found Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
          
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <label className="block text-sm font-bold mb-2">1. Snap a Picture *</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-3" required />
            
            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={!formData.picture || isAnalyzing}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
            >
              {isAnalyzing ? "✨ Processing Image & GPS..." : "✨ Auto-Fill Details & Location"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Item Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Description *</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy" rows={3} required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Tags * (Select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button key={tag} type="button" onClick={() => handleTagToggle(tag)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${formData.tags.includes(tag) ? 'bg-dark-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            <h3 className="font-bold text-lg text-dark-navy border-b pb-2">Location Data *</h3>
            
            <div>
              <label className="block text-sm font-bold mb-2">Campus Zone (For the Feed) *</label>
              <select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy bg-white" required>
                <option value="" disabled>Select a building/zone...</option>
                <option value="tisch">Tisch Library</option>
                <option value="dewick">Dewick Dining</option>
                <option value="halligan">Halligan Hall</option>
                <option value="campus">Campus Center</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Exact GPS Pin (Required for Map) *</label>
              
              <button 
                type="button" 
                onClick={getLocation} 
                disabled={locationLoading || (formData.lat !== 0 && formData.long !== 0)} 
                className={`w-full px-4 py-3 font-bold rounded-lg transition-all ${
                  formData.lat !== 0 && formData.long !== 0
                    ? "bg-green-100 border-2 border-green-500 text-green-700 cursor-not-allowed"
                    : "bg-white border-2 border-dark-navy text-dark-navy hover:bg-gray-100"
                }`}
              >
                {locationLoading 
                  ? '⏳ Capturing coordinates...' 
                  : (formData.lat !== 0 && formData.long !== 0)
                    ? '✅ GPS Pin Locked' 
                    : '📍 Drop GPS Pin (Fallback)'}
              </button>
              
              {formData.lat !== 0 && formData.long !== 0 && (
                <p className="mt-2 text-sm text-green-600 font-medium text-center">
                  Coordinates saved for map view.
                </p>
              )}
              {locationError && <p className="mt-2 text-sm text-red-600 text-center font-medium">{locationError}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="block text-sm font-bold text-dark-navy">Contact Information (At least one required)</label>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy focus:border-transparent" placeholder="(123) 456-7890" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy focus:border-transparent" placeholder="your.email@tufts.edu" />
            </div>
          </div>

          <button type="submit" className="w-full px-6 py-4 bg-dark-navy text-white text-lg font-bold rounded-lg hover:opacity-90 transition shadow-md">
            Submit Found Item
          </button>
        </form>
      </div>
    </div>
  );
}
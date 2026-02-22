"use client";


import { analyzeImage } from '../actions/analyzeImage';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportItem() {
  const router = useRouter();
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

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]); 

  const fetchTags = async (): Promise<string[]> => {
  try {
    const res = await fetch('/tags');
    const data = await res.json();
    // Extract only the "name" field from each object
    return data.data.map((item: any) => String(item.name));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return []; // return empty array on error
  }
};

const fetchLocations = async (): Promise<string[]> => {
  try {
    const res = await fetch('/locations');
    const data = await res.json();
    // Extract only the "name" field from each object
    return data.data.map((item: any) => String(item.name));
  } catch (error) {
    console.error('Error fetching locations:', error);
    return []; // return empty array on error
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tags = await fetchTags(); 
        setAvailableTags(tags);

        const loc = await fetchLocations(); 
        setLocations(loc);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); 
  }, []); 
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

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Step 1: Validation

    if (formData.lat === 0 || formData.long === 0) {
      alert('Mandatory: We need the exact GPS location to accept this item. Please click "Drop GPS Pin" or the AI button and allow browser permissions.');
      return;
    }

    if (!formData.name || !formData.description || formData.tags.length === 0 || !formData.location) {
      alert('Please fill in all required fields (Name, Description, Tags, and Campus Zone)'); 
      return;
    }
    
    if (!formData.picture) {
      alert('Please upload a picture of the item');
      return;
    }

    // Step 2: Package the data exactly to match the backend's expected keys
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('desc', formData.description); // matches 'desc'
    dataToSend.append('tags', formData.tags.join(',')); // matches comma-separated string
    dataToSend.append('loc', formData.location);
    dataToSend.append('lng', formData.long.toString()); // matches 'lng'
    dataToSend.append('img', formData.picture); // matches 'img'
    
    if (formData.phone) dataToSend.append('phoneNumber', formData.phone); // matches 'phoneNumber'
    if (formData.email) dataToSend.append('email', formData.email);

    // Step 3: Send data to the backend and handle the redirect
    try {
      // Send the POST request to the app/report/route.ts file
      const response = await fetch('/report', {
        method: 'POST',
        body: dataToSend, 
      });

      if (response.ok) {
        // Success! Redirect the user to the congratulations page
        router.push('/reportsuccess');
      } else {
        // If the backend sends an error (e.g. 400 Bad Request)
        const errorData = await response.json();
        alert(`Error: ${errorData.msg || 'Failed to submit item'}`);
      }
    } catch (error) {
      // If the network fails completely
      console.error('Submission error:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
};

  return (
    <div className="min-h-full bg-light-beige p-6 mt-22">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6 text-black" >
          Report Found Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
          
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <label className="block text-sm font-bold mb-2 text-black">1. Snap a Picture *</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-3" required />
            
            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={isAnalyzing}
              className="w-full cursor-pointer px-4 py-3 bg-gradient-to-r from-dark-navy to-dark-yellow text-white font-bold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg active:translate-y-0 active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-md flex items-center justify-center gap-2 shadow-md"
            >
              {isAnalyzing ? "✨ Processing Image & GPS..." : "✨ Auto-Fill Details & Location"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">Item Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">Description *</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy" rows={3} required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">Tags * (Select all that apply)</label>
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
              <label className="block text-sm font-bold mb-2 text-black">Campus Zone (For the Feed) *</label>
              <select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy bg-white text-black" required>
                <option value="" disabled>Select a building/zone...</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-black">Exact GPS Pin (Required for Map) *</label>
              
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
            <label className="block text-sm font-bold text-black">Contact Information (Optional)</label>
            <div>
              <label className="block text-xs text-black mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-navy focus:border-transparent" placeholder="(123) 456-7890" />
            </div>
            <div>
              <label className="block text-xs text-black mb-1">Email</label>
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

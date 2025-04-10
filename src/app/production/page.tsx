'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronDown } from 'lucide-react';

type Product = {
  _id: string;
productName: string;
  weights: {
    value: number;
    unit: string;
  }[];
};

type FormData = {
  productId: string;
  weight: { value: number; unit: string } | null;
  quantity: number;
};

export default function ProductionPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    productId: '',
    weight: null,
    quantity: 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, weight: null }));
  }, [formData.productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setFormData(prev => ({ ...prev, quantity: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const [value, unit] = e.target.value.split('-');
      setFormData(prev => ({
        ...prev,
        weight: { value: parseFloat(value), unit },
      }));
    } else {
      setFormData(prev => ({ ...prev, weight: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.productId || !formData.weight || formData.quantity <= 0) {
      setError('All fields are required and quantity must be greater than 0');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Failed to record production');
      router.push('/production');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p._id === formData.productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">Record Production</h1>
    <p className="text-gray-500 text-sm">Track your manufacturing output</p>
  </div>

  {error && (
    <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start">
      <svg className="h-5 w-5 mt-0.5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <span className="text-sm">{error}</span>
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Product Select */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 transition duration-150"
          required
        >
          <option value="">Select product</option>
          {products.map(p => (
            <option key={p._id} value={p._id} className='text-gray-950'>{p.productName}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0  flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-black" />
        </div>
      </div>
    </div>

    {/* Weight Select */}
    {selectedProduct && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={formData.weight ? `${formData.weight.value}-${formData.weight.unit}` : ''}
            onChange={handleWeightChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 transition duration-150"
            required
          >
            <option value="">Select weight</option>
            {selectedProduct.weights.map((w, idx) => (
              <option key={idx} value={`${w.value}-${w.unit}`}>
                {w.value} {w.unit}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-black" />
          </div>
        </div>
      </div>
    )}

    {/* Quantity Input */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quantity <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        min={1}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        required
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-150 ${
        isSubmitting 
          ? 'bg-blue-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          Recording...
        </span>
      ) : (
        'Record Production'
      )}
    </button>
  </form>
</div>
  );
}

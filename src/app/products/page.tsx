'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type WeightOption = {
  value: string;
  unit: string;
};

const unitOptions = ['g', 'kg', 'ml', 'l', 'pcs'];

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: '',
    weights: [{ value: '', unit: 'g' }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: keyof WeightOption
  ) => {
    if (typeof index === 'number' && field) {
      const updatedWeights = [...formData.weights];
      updatedWeights[index][field] = e.target.value;
      setFormData({ ...formData, weights: updatedWeights });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addWeight = () => {
    setFormData({
      ...formData,
      weights: [...formData.weights, { value: '', unit: 'g' }],
    });
  };

  const removeWeight = (index: number) => {
    const newWeights = formData.weights.filter((_, i) => i !== index);
    setFormData({ ...formData, weights: newWeights });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.productName.trim()) {
      setError('Product name is required');
      setIsSubmitting(false);
      return;
    }

    const hasEmpty = formData.weights.some(w => !w.value.trim());
    if (hasEmpty) {
      setError('All weights must be filled');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.productName,
          weights: formData.weights.map(w => ({
            value: parseFloat(w.value),
            unit: w.unit,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to save product');
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Product Name *</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., Wheat Flour"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Weight Options *</label>
          {formData.weights.map((w, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                type="number"
                placeholder="Value"
                value={w.value}
                onChange={(e) => handleChange(e, i, 'value')}
                className="w-2/3 border px-3 py-2 rounded"
                step="0.01"
              />
              <select
                value={w.unit}
                onChange={(e) => handleChange(e, i, 'unit')}
                className="w-1/3 border px-2 py-2 rounded"
              >
                {unitOptions.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {formData.weights.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWeight(i)}
                  className="text-red-500 font-bold ml-2"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addWeight}
            className="text-blue-600 hover:underline mt-1"
          >
            + Add another weight
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

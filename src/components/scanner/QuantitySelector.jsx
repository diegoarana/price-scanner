import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const QuantitySelector = ({ value, onChange, label = 'Cantidad' }) => {
  const handleDecrement = () => {
    onChange(Math.max(1, value - 1));
  };

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleInputChange = (e) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div className='flex justify-between items-center mt-2 bg-gray-200 rounded pt-1 pb-1 px-3'>
      {label && <div className="text-sm text-gray-600 text-center">{label}</div>}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleDecrement}
          className="p-1 bg-white rounded transition-colors"
          aria-label="Decrementar"
        >
          <ChevronDown className="w-5 h-5 text-gray-700" />
        </button>
        <input 
          type="number" 
          value={value} 
          onChange={handleInputChange}
          className="w-15 h-8 border rounded text-center font-semibold bg-white" 
        />
        <button
          onClick={handleIncrement}
          className="p-1 bg-white rounded transition-colors"
          aria-label="Incrementar"
        >
          <ChevronUp className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;

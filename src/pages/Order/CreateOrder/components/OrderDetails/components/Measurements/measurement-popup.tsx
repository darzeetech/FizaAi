'use client';

import type React from 'react';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { useEffect, useState } from 'react';

interface MeasurementParam {
  key: string;
  value: number;
  outfit_ordinal: number;
  created_at: string;
}

interface MeasurementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    imported_measurement_params: MeasurementParam[];
  };
  title?: string;
}

// Helper function to format measurement keys to readable labels
const formatMeasurementKey = (key: string): string => {
  // Special case for neck (in the image it shows as "Neck6")
  if (key === 'neck') {
    return 'Neck6';
  }

  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const MeasurementPopup: React.FC<MeasurementPopupProps> = ({
  isOpen,
  onClose,
  data,
  title = "Men's Suit",
}) => {
  const [measurementParams, setMeasurementParams] = useState<MeasurementParam[]>([]);
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    if (data && data.imported_measurement_params && data.imported_measurement_params.length > 0) {
      setMeasurementParams(data.imported_measurement_params);
      setDateString(formatDate(data.imported_measurement_params[0].created_at));
    }
  }, [data]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed w-full inset-0 bg-white z-[8000] overflow-auto rounded-md">
      <div className="w-full px-[1.5rem] mx-auto">
        <header onClick={onClose} className="p-5 flex items-center cursor-pointer">
          <button className="flex items-center text-gray-800" aria-label="Back">
            <MdOutlineKeyboardArrowLeft className="size-8 font-bold " />
          </button>
          <h1 className="text-[1.4rem] text-[#323232] font-medium ml-2">{title}</h1>
        </header>

        <div className="px-6 pb-6">
          <h2 className="text-[1.2rem] text-[#323232] font-medium  mb-6">
            Measurements copied from
          </h2>

          <div className="border rounded-xl p-6">
            <h3 className="text-[1.1rem] font-medium mb-6">
              {title} <span className="text-gray-500 italic size-6">({dateString})</span>
            </h3>

            <div className="space-y-5">
              {measurementParams.map((param, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[.95rem] text-gray-700 font-semibold">
                    {formatMeasurementKey(param.key)}
                  </span>
                  <span className="text-[1rem] font-medium">{param.value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

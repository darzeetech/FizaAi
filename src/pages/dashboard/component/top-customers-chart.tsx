'use client';
import type { ChartData } from './chart-component';
import { useState } from 'react';

interface TopCustomersChartProps {
  chartData?: ChartData; // Make chartData optional
}

export default function TopCustomersChart({ chartData }: TopCustomersChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Early return with a placeholder if chartData is undefined or empty
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return (
      <div className="w-full rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white p-6">
        <h3 className="text-center text-xl font-bold mb-6">Top Customers</h3>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Sort data by score in descending order for the bar chart
  const sortedData = [...chartData.data].sort((a, b) => b.score - a.score);

  // eslint-disable-next-line no-console
  // console.log(sortedData);

  // Find the maximum score to calculate relative heights
  const maxScore = Math.max(...sortedData.map((item) => item.score), 1); // Ensure non-zero

  // Debug bar heights
  // eslint-disable-next-line no-console
  // console.log(
  //   'Bar heights:',
  //   sortedData.map((item) => ({
  //     title: item.title,
  //     score: item.score,
  //     height: Math.max((item.score / maxScore) * 100, 5),
  //   }))
  // );

  return (
    <div className="w-full rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white p-6">
      <h3 className=" text-xl font-bold mb-6">{chartData.title || 'Top Customers'}</h3>

      <div className="flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="w-full md:w-2/3 h-64 flex items-end justify-around">
          {sortedData.map((item, index) => {
            // Calculate height percentage based on score
            const heightPercentage = Math.max((item.score / maxScore) * 220, 5); // Minimum 5% height for visibility
            const isHovered = hoveredIndex === index;

            // Ensure color has proper format
            const barColor = item.color
              ? item.color.startsWith('#')
                ? item.color
                : `#${item.color}`
              : '#cccccc';

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`relative w-12 md:w-16 rounded-t-md transition-all duration-300 ${
                    isHovered ? 'opacity-80 scale-105' : 'opacity-100'
                  }`}
                  style={{
                    backgroundColor: barColor,
                    height: `${heightPercentage}px`,
                    minHeight: '40px', // Ensure bars are always visible
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      ₹ {item.score.toLocaleString()}
                    </div>
                  )}
                </div>
                <span className="text-xs mt-2 text-gray-600 font-bold truncate max-w-[80px] text-center">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap- md:w-1/3">
          {sortedData.map((item, index) => {
            // Ensure color has proper format
            const textColor = item.color.startsWith('#') ? item.color : `#${item.color}`;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                  hoveredIndex === index ? 'bg-gray-100' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Fallback to initial if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-medium text-gray-600">${item.title.charAt(
                          0
                        )}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-xs font-medium text-gray-600">
                      {item.title.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-[.9rem] font-semibold">
                  <span style={{ color: textColor }}>{item.title}</span>
                  <span className="text-sm text-gray-500">₹ {item.score.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

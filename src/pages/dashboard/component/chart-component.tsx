'use client';
import { VictoryPie } from 'victory';

// Define types for our data
export interface ChartItem {
  title: string;
  image: string;
  score: number;
  color: string;
}

export interface ChartData {
  title: string;
  data: ChartItem[];
}

interface ChartComponentProps {
  chartData?: ChartData;
}

export default function ChartComponent({ chartData }: ChartComponentProps) {
  // If chartData is undefined or doesn't have data, return null or a fallback UI
  if (!chartData || !chartData.data) {
    return null; // Or return a fallback UI like <div>No chart data available</div>
  }

  // Format the data for Victory Chart
  const pieData = chartData.data.map((item) => ({
    x: item.title,
    y: item.score,
    color: `#${item.color}`,
  }));

  // Extract title and amount from the item title
  const formatLegendItem = (title: string) => {
    const parts = title.split(' ');
    const amount = parts.pop() || '';
    const itemName = parts.join(' ');

    return { itemName, amount };
  };

  return (
    <div className="md:w-[32%] w--full h-fit rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white ">
      <div className="p-4 pb-2">
        <h3 className=" text-[1rem] font-semibold">{chartData.title}</h3>
      </div>
      <div className="flex flex-row md:flex-row items-center p-4 gap-4">
        <div className="w-36 h-36">
          <VictoryPie
            data={pieData}
            colorScale={pieData.map((d) => d.color)}
            innerRadius={0}
            padAngle={0.5}
            style={{
              labels: { display: 'none' },
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {chartData.data.map((item, index) => {
            const { itemName, amount } = formatLegendItem(item.title);

            return (
              <div key={index} className="flex items-center gap-2 text-[.8rem]">
                {item.image ? (
                  <div className="w-5 h-5 relative pt-1">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={itemName}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: `#${item.color}` }}
                  />
                )}
                <span style={{ color: `#${item.color}` }} className="font-bold">
                  {itemName}:
                </span>
                <span style={{ color: `#${item.color}` }} className="font-bold">
                  {chartData.title === 'Outfit Count' ? amount : `₹ ${amount}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

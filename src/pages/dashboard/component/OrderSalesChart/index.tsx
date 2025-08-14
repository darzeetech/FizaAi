import { VictoryPie } from 'victory';
import { convertNumberOrStringToPriceFormat } from '../../../../utils/common';
import { Text } from '../../../../ui-component';
import { ChartInfo, Container, ChartColorBox } from './style';

type Summary = {
  amount: number;
  order_type: string;
};

type OrderSalesChartProps = {
  data: Summary[];
};

const OrderSalesChart = (props: OrderSalesChartProps) => {
  const { data } = props;

  const colorScale = {
    Stitching: '#D1ADDF',
    Alteration: '#FFD495',
  };

  const totalAmount: number = data.reduce((sum, obj) => (sum += obj.amount), 0);

  const chartData = data.map((obj) => {
    return {
      x: obj.order_type,
      y: totalAmount !== 0 ? parseFloat(((obj.amount / totalAmount) * 100).toFixed(1)) : 0,
    };
  });

  return (
    <Container isEmpty={totalAmount === 0}>
      <div className="header">
        <Text fontWeight={700}>Sales Split</Text>
      </div>
      <div className="content">
        {chartData.length > 0 && totalAmount > 0 && (
          <>
            <svg className="inner-circle">
              <circle
                cx="50%"
                cy="50%"
                r="20%" // Adjust the radius as needed
                fill="none"
                stroke="var(--color-ghost)"
                strokeWidth={0.5}
              />
            </svg>

            <svg className="outer-circle">
              <circle
                cx="50%"
                cy="50%"
                r="37%" // Adjust the radius as needed
                fill="none"
                stroke="var(--color-ghost)"
                strokeWidth={0.5}
              />
            </svg>
            <VictoryPie
              data={chartData}
              labels={({ datum }) => `${datum.y} %`}
              innerRadius={100}
              colorScale={['#D1ADDF', '#FFD495']}
              labelPosition="centroid"
              style={{
                labels: {
                  fontSize: 18,
                  fontWeight: 700,
                  fill: '#232323',
                  margin: '10px',
                },
              }}
            />
          </>
        )}

        <div>
          {data.map((obj, index) => (
            <ChartInfo key={index}>
              <div className="label">
                <ChartColorBox bgColor={colorScale[obj.order_type as keyof typeof colorScale]} />
                <Text size="small" fontWeight={600}>
                  {obj.order_type}
                </Text>
              </div>
              <Text size="small" fontWeight={600}>
                &#8377;
                {convertNumberOrStringToPriceFormat(obj.amount)}
              </Text>
            </ChartInfo>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default OrderSalesChart;

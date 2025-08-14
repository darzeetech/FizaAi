import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';

import { convertNumberOrStringToPriceFormat } from '../../../../utils/common';
import { moneyFormatSigns } from '../../../../utils/contant';
import { Text } from '../../../../ui-component';
import { Container } from './style';

type SalesSummary = {
  total_sales: number;
  week_start_date: string;
};

type WeeklySalesrops = {
  data: SalesSummary[];
  total_sales: number;
  max_bar_graph_length: number;
};

const WeeklySales = (props: WeeklySalesrops) => {
  const { data, total_sales } = props;

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${value / 1000000}L`;
    } else if (value >= 1000) {
      return `${value / 1000}K`;
    } else {
      return value.toString();
    }
  };

  return (
    <Container isEmpty={total_sales === 0}>
      <div className="header">
        <div className="header-content">
          <Text fontWeight={700}>Reporting Sales :</Text>
          <Text fontWeight={700}>
            {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(total_sales)}`}
          </Text>
        </div>
      </div>

      <div className="content">
        {total_sales > 0 ? (
          <VictoryChart domainPadding={30}>
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickFormat={(_, index) => `Week ${index + 1}`}
              style={{
                grid: { stroke: 'var(--color-ghost)', strokeWidth: 0.5 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(y) => formatYAxis(y)}
              style={{ grid: { stroke: 'var(--color-ghost)', strokeWidth: 0.5 } }}
            />

            <VictoryBar
              data={data.map((obj) => ({ ...obj, label: obj.total_sales }))}
              x="week_start_date"
              y="total_sales"
              labelComponent={
                <VictoryTooltip flyoutStyle={{ fill: 'black' }} style={{ fill: 'white' }} />
              }
              style={{
                data: {
                  fill: 'var(--color-primary   )', // Change the color of the bars here
                },
              }}
            />
          </VictoryChart>
        ) : (
          <Text fontWeight={500}>No Sales in this Month.</Text>
        )}
      </div>
    </Container>
  );
};

export default WeeklySales;

// MultiImageChart.tsx
import { LineChart } from "@mui/x-charts/LineChart";
import { LineSeriesType } from "@mui/x-charts/models/seriesType";
import React from "react";
import { ChartModel } from "../model/ChartModel"; // Adjust the import path as necessary
interface MultiImageChartProps {
  chartData: ChartModel[];
}

const MultiImageChart: React.FC<MultiImageChartProps> = ({ chartData }) => {
  // Process data into series format for the LineChart
  const processDataToSeries = (chartData: ChartModel[]) => {
    const groupedData = chartData.reduce(
      (acc: Record<number, { x: Date; y: number }[]>, curr) => {
        const imageId = curr.image_id;
        const date = new Date(curr.date);
        if (!acc[imageId]) {
          acc[imageId] = [];
        }
        acc[imageId].push({ x: date, y: curr.votes_gained });
        return acc;
      },
      {}
    );

    return Object.entries(groupedData).map(([imageId, dataPoints]) => {
      // Sort the data points by date
      dataPoints.sort((a, b) => a.x.getTime() - b.x.getTime());
      // Filter out to get the latest 7 data points
      const lastSevenDataPoints = dataPoints.slice(-7);
      return {
        label: `Image ${imageId}`,
        data: lastSevenDataPoints,
        showMark: true,
      };
    });
  };

  // Prepare the series for the LineChart component
  // const series = processDataToSeries(chartData);
  const series = processDataToSeries(chartData).map(
    (s) =>
      ({
        ...s,
        // Assuming the LineChart expects an array of numbers for the data prop
        data: s.data.map((dp) => dp.y), // Convert to array of numbers
      } as LineSeriesType)
  );
  // Assuming chartData is already sorted by date, take the latest 7 unique dates
  const latestDates = chartData
    .map((data) => new Date(data.date))
    .filter(
      (date, index, self) =>
        self.findIndex((d) => d.getTime() === date.getTime()) === index
    )
    .slice(-7);

  return (
    <LineChart
      width={590}
      height={300}
      xAxis={[
        {
          data: latestDates,
          scaleType: "time",
          valueFormatter: (date: Date) =>
            date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
        },
      ]}
      series={series}
    />
  );
};

export default MultiImageChart;

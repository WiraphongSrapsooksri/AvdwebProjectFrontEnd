// MultiImageChart.tsx
import { LineChart } from "@mui/x-charts/LineChart";
import { LineSeriesType } from "@mui/x-charts/models/seriesType";
import React from "react";
import { ChartModel } from "../model/ChartModel"; // Adjust the import path as necessary
import "../style/MultiImageChart.css";

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
      // Assume we want to get data points between the 4th and 10th of the current month
      const startOfPeriod = new Date();
      startOfPeriod.setDate(4); // Set to the 4th
      startOfPeriod.setHours(0, 0, 0, 0);
      const endOfPeriod = new Date();
      endOfPeriod.setDate(10); // Set to the 10th
      endOfPeriod.setHours(23, 59, 59, 999);

      const filteredDataPoints = dataPoints.filter((dp) => {
        return dp.x >= startOfPeriod && dp.x <= endOfPeriod;
      });

      return {
        label: `Image ${imageId}`,
        data: filteredDataPoints,
        showMark: true,
      };
    });
  };

  // Prepare the series for the LineChart component
  const series = processDataToSeries(chartData).map(
    (s) =>
      ({
        ...s,
        data: s.data.map((dp) => dp.y), // Convert to array of numbers
      } as LineSeriesType)
  );

  // Prepare the dates for the X axis of the LineChart component
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6); // 7 days before today, including today
  startDate.setHours(0, 0, 0, 0); // Normalize the time to midnight
  endDate.setHours(23, 59, 59, 999);

  const latestDates = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    latestDates.push(new Date(d));
  }

  return (
    <LineChart
      className="my-custom-chart"
      width={550}
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

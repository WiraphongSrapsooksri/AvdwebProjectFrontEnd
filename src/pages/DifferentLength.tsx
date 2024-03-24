// import { LineChart } from '@mui/x-charts/LineChart';

// import { ChartModel } from '../model/ChartModel';
// interface DifferentLengthProps {
//     chartData: ChartModel[];
//   }

//   export default function DifferentLength({ chartData }: DifferentLengthProps) {
//     console.log('chartData:', chartData); // Debugging line

//     const processData = () => {
//       const seriesMap = new Map<number, { curve: string; data: number[] }>();

//       chartData.forEach(item => {
//         if (!seriesMap.has(item.image_id)) {
//           seriesMap.set(item.image_id, { curve: 'natural', data: [] });
//         }
//         seriesMap.get(item.image_id)?.data.push(item.votes_gained);
//       });

//       const processedData = Array.from(seriesMap.values());
//       console.log('Processed Data:', processedData); // Debugging line
//       return processedData;
//     };

//     return (
//       <LineChart
//         series={processData()}
//       />
//     );
//   }

// import { LineChart } from '@mui/x-charts/LineChart';
// import { ChartModel } from "../model/ChartModel";

// interface DifferentLengthProps {
//   chartData: ChartModel[];
// }

// export default function DifferentLength({ chartData }: DifferentLengthProps) {
//   const processData = () => {
//     const seriesMap = new Map<number, { name: string; curve: string; data: { x: string; y: number }[]; image: string }>();

//     chartData.forEach(item => {
//       if (!seriesMap.has(item.image_id)) {
//         seriesMap.set(item.image_id, {
//           name: `Image ID: ${item.image_id}`,
//           curve: "natural",
//           data: [],
//           image: item.image_id.toString(),
//         });
//       }
//       const entry = seriesMap.get(item.image_id);
//       if (entry) {
//         entry.data.push({ x: item.date, y: item.votes_gained });
//       }
//     });

//     return Array.from(seriesMap.values()).map(series => ({
//       data: series.data.map(point => point.y), // Assuming y-values are what you want to plot
//       // Add more series configuration as needed
//     }));
//   };

//   // Note: Adjustments may be required depending on the specific requirements and capabilities of your LineChart component
//   return (
//     <LineChart
//       series={processData()}
//       // Additional props as required by your specific charting needs
//       width={500}
//       height={300}
//     />
//   );
// }

// import { LineChart } from "@mui/x-charts/LineChart";
// import { ChartModel } from "../model/ChartModel";

// interface DifferentLengthProps {
//   chartData: ChartModel[];
// }

// export default function DifferentLength({ chartData }: DifferentLengthProps) {
//   const processData = () => {
//     // Get the unique image_ids and the full range of dates.
//     const imageIds = Array.from(
//       new Set(chartData.map((item) => item.image_id))
//     );
//     const dates = Array.from(
//       new Set(chartData.map((item) => item.date))
//     ).sort();
//     const dateMap = Object.fromEntries(dates.map((date) => [date, null]));

//     // Create a map with a full date range for each image_id.
//     const seriesMap = new Map<
//       number,
//       { name: string; curve: string; data: { x: Date; y: number | null }[] }
//     >();
//     imageIds.forEach((imageId) => {
//       seriesMap.set(imageId, {
//         name: `Image ID: ${imageId}`,
//         curve: "natural",
//         data: dates.map((date) => ({ x: new Date(date), y: dateMap[date] })),
//       });
//     });

//     // Populate the data points that exist.
//     chartData.forEach((item) => {
//       const entry = seriesMap.get(item.image_id);
//       const dataPoint = entry?.data.find(
//         (point) => point.x.getTime() === new Date(item.date).getTime()
//       );
//       if (dataPoint) {
//         dataPoint.y = item.votes_gained;
//       }
//     });

//     // Sort the data and return the series.
//     return Array.from(seriesMap.values()).map((series) => {
//       series.data.sort((a, b) => a.x.getTime() - b.x.getTime());
//       return {
//         data: series.data,
//         name: series.name,
//       };
//     });
//   };

//   return (
//     <LineChart
//       series={processData().map((series) => ({
//         ...series,
//         data: series.data.map((point) => (point.y === null ? null : point.y)),
//       }))}
//     //   xAccessor={(d: { x: Date }) => d.x}
//     //   xScaleType="time"
//       width={500}
//       height={300}
//     />
//   );
// }

import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"; // Ensure you import from 'recharts'
import { ChartModel } from "../model/ChartModel";

interface DifferentLengthProps {
  chartData: ChartModel[];
}

export default function DifferentLength({ chartData }: DifferentLengthProps) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300" ,"#FF5DF3"];
  const processData = () => {
    // Get the unique image_ids and the full range of dates.
    const imageIds = Array.from(
      new Set(chartData.map((item) => item.image_id))
    );
    const dates = Array.from(
      new Set(chartData.map((item) => item.date))
    ).sort();
    const dateMap = Object.fromEntries(dates.map((date) => [date, null]));

    // Create a map with a full date range for each image_id.
    const seriesMap = new Map<
      number,
      { name: string; curve: string; data: { x: Date; y: number | null }[] }
    >();
    imageIds.forEach((imageId) => {
      seriesMap.set(imageId, {
        name: `Image ID: ${imageId}`,
        curve: "natural",
        data: dates.map((date) => ({ x: new Date(date), y: dateMap[date] })),
      });
    });

    // Populate the data points that exist.
    chartData.forEach((item) => {
      const entry = seriesMap.get(item.image_id);
      const dataPoint = entry?.data.find(
        (point) => point.x.getTime() === new Date(item.date).getTime()
      );
      if (dataPoint) {
        dataPoint.y = item.votes_gained;
      }
    });

    // Sort the data and return the series.
    return Array.from(seriesMap.values()).map((series) => {
      series.data.sort((a, b) => a.x.getTime() - b.x.getTime());
      return {
        data: series.data,
        name: series.name,
      };
    });
  };
  const seriesData = processData();

  const formatDate = (date: Date) => {
    const options = { month: "short", day: "numeric" } as const;
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <LineChart width={500} height={290} data={seriesData}>
      <XAxis
        dataKey="x"
        type="category"
        allowDuplicatedCategory={false}
        tickFormatter={formatDate}
        fontFamily="Kanit"
        fontSize={12}
      />
      <YAxis dataKey="y" fontFamily="Kanit" />
      {seriesData.map((series, index) => (
        <Line
          key={index}
          type="monotone"
          dataKey="y"
          data={series.data}
          name={`${series.name}`}
          stroke={colors[index % colors.length]} // Cycle through colors
          activeDot={{ r: 5 }}
        />
      ))}
      <Tooltip />
      <Legend
        formatter={(value) => (
          <span
            style={{
              fontFamily: "Kanit",
              padding: 0,
              margin: 0,
              fontSize: "12px",
            }}
          >
            {value}
          </span>
        )}
      />
    </LineChart>
  );
}

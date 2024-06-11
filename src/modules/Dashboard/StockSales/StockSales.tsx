"use client";

import { CircularProgress, Text, Flex, Box, Center } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import "./styles.css";

// Apex Chart Config
import dynamic from "next/dynamic";
import { format } from "path";
import { LineChartData } from "@/interfaces/LineChartData";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StockSales = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [time, setTime] = useState<number>(0);
  const [apexChartData, setApexChartData] = useState<LineChartData[]>([]);

  useEffect(() => {
    const getStockSalesPrediction = async () => {
      setIsLoading(true);
      const predictResponse = await fetch(`${process.env.NEXT_PUBLIC_FAST_API_URL}/stock-sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!predictResponse.ok) {
        const errorMessage = await predictResponse.json();
        console.log(errorMessage);
        return;
      }
      let predictionResult = await predictResponse.json();
      predictionResult = predictionResult.result;

      //   SET APEX CHART DATA
      const stockData: LineChartData[] = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Set start date to tomorrow

      for (let i = 0; i < predictionResult.length; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        stockData.push({ x: date.toISOString().slice(0, 10), y: predictionResult[i] });
      }

      setApexChartData(stockData);
      setIsLoading(false);
    };
    getStockSalesPrediction();
  }, [time]);

  //   ============================  DUMMY DATA ============================
  //   const dummy_data = [
  //     { x: "2023-01-01", y: 30 },
  //     { x: "2023-01-02", y: 40 },
  //     { x: "2023-01-03", y: 35 },
  //     { x: "2023-01-04", y: 50 },
  //     { x: "2023-01-05", y: 49 },
  //     { x: "2023-01-06", y: 60 },
  //     { x: "2023-01-07", y: 70 },
  //     { x: "2023-01-08", y: 91 },
  //   ];

  //   const dummy_data: LineChartData[] = [];
  //   const startDate = new Date();
  //   startDate.setDate(startDate.getDate() + 1); // Set start date to tomorrow

  //   for (let i = 0; i < 365; i++) {
  //     const date = new Date(startDate);
  //     date.setDate(startDate.getDate() + i);
  //     const randomNumber = Math.random() * 100; // * (100 - 50) + 50; // Generate random number between 50 and 100
  //     dummy_data.push({ x: date.toISOString().slice(0, 10), y: randomNumber });
  //   }
  //   let previousY = Math.random() * 50 + 50; // Generate a random starting value between 50 and 100
  //   for (let i = 0; i < 365; i++) {
  //     const date = new Date(startDate);
  //     date.setDate(startDate.getDate() + i);
  //     const maxYChange = Math.min(previousY + 5, 100); // Ensure that maxYChange does not exceed 100
  //     const minYChange = Math.max(previousY - 5, 50); // Ensure that minYChange does not go below 50
  //     const newY = Math.random() * (maxYChange - minYChange) + minYChange; // Generate a random value within the range
  //     dummy_data.push({ x: date.toISOString().slice(0, 10), y: newY });
  //     previousY = newY; // Update previousY for the next iteration
  //   }

  //   ============================ END OF DUMMY DATA ============================

  const lineApexChart = {
    series: [
      {
        name: "Stock Sales",
        data: apexChartData,
      },
    ],
    options: {
      chart: {
        type: "line" as const,
        stacked: false,
        width: "100%",
        zoom: {
          type: "x" as const,
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom" as const,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        colors:["#50C878"],
        size: 0,
      },
      //   title: {
      //     text: "Sales Forecasting Chart",
      //     align: "left" as const,
      //   },
      yaxis: {
        min: 0,
        labels: {
          show: true,
          style: {
            colors: "#ffffff",
            fontSize: "12px",
          },
        },
        title: {
          text: "Stocks",
          style: {
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 100,
          },
        },
      },
      xaxis: {
        type: "datetime" as const,
        labels: {
          show: true,
          style: {
            colors: "#ffffff",
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: "dark" as const,
        shared: false,
        x: {
          show: true,
          formatter: function (val) {
            // Parse the value to a date object
            const date = new Date(val);
            // Check if the parsed date is valid
            if (isNaN(date.getTime())) {
              // If the date is invalid, return an empty string
              return "";
            }
            // Format the date to "DD MMM YYYY"
            const formattedDate = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
            return formattedDate;
          },
        },
      },
      stroke: {
        show: true,
        width: 3,
        colors:["#50C878"],
      },
    },
  };

  return (
    <Flex flex="1" padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" minWidth={{ base: "100%", xl: "calc(50% - 2rem)" }} w="100%" minH="10rem" flexDirection="column" alignItems="center" gap="1rem">
      <Text fontSize="lg" fontWeight="medium">
        Stock Sales
      </Text>
      <Box width="100%">
        {isLoading ? (
          <Center>
            <CircularProgress isIndeterminate color="green.300" marginBottom="0.5rem" />
          </Center>
        ) : (
          <ApexChart options={lineApexChart.options} series={lineApexChart.series} type="line" width={"100%"} height={"350"} />
        )}
      </Box>
    </Flex>
  );
};

export default StockSales;

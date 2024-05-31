"use client";

import React, { useContext, useEffect, useState } from "react";
import { CustomerSegmentationResponse } from "@/interfaces/CustomerSegmentationResponse";
import { CustomerSegmentationPerformContext } from "@/utils/performContext";
import { Center, CircularProgress, Text, Flex, Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
// Apex Chart Config
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CustomerSegmentation = () => {
  const { data: session, status } = useSession();
  const { customerSegmentationPerformStatus } = useContext(CustomerSegmentationPerformContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerSegmentation, setCustomerSegmentation] = useState<CustomerSegmentationResponse>({ bronzeCount: 0, silverCount: 0, goldCount: 0, diamondCount: 0 });

  useEffect(() => {
    async function fetchCustomerSegmentation() {
      setIsLoading(true);
      try {
        const methodAndHeader = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session!.user.accessToken}`,
          },
        };
        const response = await fetch("/api/v1/customer-segmentation", methodAndHeader);
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          // Get Churn count
          for (const loop of data) {
            if (loop["segmentation"] === "Bronze") {
              console.log("loop count bronze:", loop["count"]);
              setCustomerSegmentation((prevState) => ({
                ...prevState,
                bronzeCount: loop["count"],
              }));
            } else if (loop["segmentation"] === "Silver") {
              console.log("loop count silver:", loop["count"]);
              setCustomerSegmentation((prevState) => ({
                ...prevState,
                silverCount: loop["count"],
              }));
            } else if (loop["segmentation"] === "Gold") {
              console.log("loop count gold:", loop["count"]);
              setCustomerSegmentation((prevState) => ({
                ...prevState,
                goldCount: loop["count"],
              }));
            } else if (loop["segmentation"] === "Diamond") {
              console.log("loop count diamond:", loop["count"]);
              setCustomerSegmentation((prevState) => ({
                ...prevState,
                diamondCount: loop["count"],
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    if (session) fetchCustomerSegmentation();
  }, [session]);

  const maxVal = Math.max(customerSegmentation.bronzeCount, customerSegmentation.silverCount, customerSegmentation.goldCount, customerSegmentation.diamondCount);

  function valueToPercent(value) {
    return (value * 100) / maxVal;
  }

  const radialbarApexChart = {
    series: [valueToPercent(customerSegmentation.bronzeCount), valueToPercent(customerSegmentation.silverCount), valueToPercent(customerSegmentation.goldCount), valueToPercent(customerSegmentation.diamondCount)],
    options: {
      chart: {
        height: 390,
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: "16px",
            },
            value: {
              show: false,
            },
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            margin: 8,
            fontSize: "16px",
            formatter: function (seriesName, opts) {
              const count = (opts.w.globals.series[opts.seriesIndex] * maxVal) / 100;
              return seriesName + ":  " + count;
            },
          },
          track: {
            show: true,
            startAngle: undefined,
            endAngle: undefined,
            background: "#f2f2f2",
            strokeWidth: "97%",
            opacity: 1,
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5,
            },
          },
        },
      },
      colors: ["#6A3805", "#545454", "#AF9500", "#34ebc9"],
      labels: ["Bronze", "Silver", "Gold", "Diamond"],
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              width: "250",
              height: "250",
            },
            plotOptions: {
              radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                  margin: 5,
                  size: "30%",
                  background: "transparent",
                  image: undefined,
                },
                dataLabels: {
                  name: {
                    show: true,
                    fontSize: "10px",
                  },
                  value: {
                    show: false,
                  },
                },
                barLabels: {
                  enabled: true,
                  useSeriesColors: true,
                  margin: 8,
                  fontSize: "10px",
                  formatter: function (seriesName, opts) {
                    const count = (opts.w.globals.series[opts.seriesIndex] * maxVal) / 100;
                    return seriesName + ":  " + count;
                  },
                },
                track: {
                  show: true,
                  startAngle: undefined,
                  endAngle: undefined,
                  background: "#f2f2f2",
                  strokeWidth: "97%",
                  opacity: 1,
                  margin: 5, // margin is in pixels
                  dropShadow: {
                    enabled: false,
                    top: 0,
                    left: 0,
                    blur: 3,
                    opacity: 0.5,
                  },
                },
              },
            },
          },
        },
      ],
      yaxis: {
        max: maxVal,
      },
    },
  };

  return (
    <Flex flex="1" padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" minWidth={{ base: "100%", xl: "calc(50% - 2rem)" }} w="100%" minH="10rem" flexDirection="column" alignItems="center">
      <Text fontSize="lg" fontWeight="medium">
        Customer Segmentation Clustering
      </Text>

      {/* Fetching the API */}
      {isLoading === true && (
        <>
          <CircularProgress isIndeterminate color="green.300" marginBottom="0.5rem" />
        </>
      )}

      {/* Show Customer Churn */}
      {customerSegmentationPerformStatus.status !== "processing" && isLoading === false && (
        <>
          <ApexChart options={radialbarApexChart.options} series={radialbarApexChart.series} type="radialBar" width={"300"} height={"300"} />
        </>
      )}
    </Flex>
  );
};

export default CustomerSegmentation;

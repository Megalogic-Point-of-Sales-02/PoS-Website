"use client";

import React, { useContext, useEffect, useState } from "react";
import { CustomerSegmentationResponse } from "@/interfaces/CustomerSegmentationResponse";
import { CustomerSegmentationPerformContext } from "@/utils/performContext";
import { CircularProgress, Text, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CustomerSegmentation = () => {
  const { data: session } = useSession();
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
          const segmentationCounts = {
            bronzeCount: 0,
            silverCount: 0,
            goldCount: 0,
            diamondCount: 0,
          };
          data.forEach((item) => {
            if (item["segmentation"] === "Bronze") {
              segmentationCounts.bronzeCount = item["count"];
            } else if (item["segmentation"] === "Silver") {
              segmentationCounts.silverCount = item["count"];
            } else if (item["segmentation"] === "Gold") {
              segmentationCounts.goldCount = item["count"];
            } else if (item["segmentation"] === "Diamond") {
              segmentationCounts.diamondCount = item["count"];
            }
          });
          setCustomerSegmentation(segmentationCounts);
        }
      } catch (error) {
        console.error("Error fetching the data");
      } finally {
        setIsLoading(false);
      }
    }
    if (session) fetchCustomerSegmentation();
  }, [session]);

  const pieApexChart = {
    series:[customerSegmentation.bronzeCount,
      customerSegmentation.silverCount,
      customerSegmentation.goldCount,
      customerSegmentation.diamondCount,],
    chart: {
      height: 500,
    },
    labels: ["Bronze", "Silver", "Gold", "Diamond"],
    colors: ["#bf8040", "#a9a9a9", "#ffbf00", "#34ebc9"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
      },
      background: {
        enabled: true,
        foreColor: "#000",
        borderRadius: 2,
        padding: 4,

        borderColor: "#fff",
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      fontSize: "17px",
      labels: {
        colors: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 250,
            height: 250,
          },
          legend: {
            fontSize: "17px",
            labels: {
              colors: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
            },
          },
        },
      },
    ],
  };

  return (
    <Flex flex="1" padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" minWidth={{ base: "100%", xl: "calc(50% - 2rem)" }} w="100%" minH="10rem" flexDirection="column" alignItems="center">
      <Text fontSize="lg" fontWeight="medium">
        Customer Segmentation Clustering
      </Text>

      {isLoading ? (
        <CircularProgress isIndeterminate color="green.300" marginBottom="0.5rem" />
      ) : (
        customerSegmentationPerformStatus.status !== "processing" && (
          <ApexChart options={pieApexChart} series={pieApexChart.series} type="pie" width="400" height="400" />
        )
      )}
    </Flex>
  );
};

export default CustomerSegmentation;

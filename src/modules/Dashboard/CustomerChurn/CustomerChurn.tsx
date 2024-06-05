"use client";

import { CustomerChurnResponse } from "@/interfaces/CustomerChurnResponse";
import { CustomerChurnPredictionContext } from "@/utils/predictionContext";
import { Center, CircularProgress, Text, Flex, Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";

// Apex Chart Config
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CustomerChurn = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { customerChurnPredictionStatus } = useContext(CustomerChurnPredictionContext);
  const [customerChurn, setCustomerChurn] = useState<CustomerChurnResponse>({ churnCount: 0, notChurnCount: 0 });

  useEffect(() => {
    async function fetchCustomerChurn() {
      console.log("customerChurn modules prediction status:", customerChurnPredictionStatus);
      setIsLoading(true);
      try {
        const methodAndHeader = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session!.user.accessToken}`,
          },
        };
        const response = await fetch("/api/v1/customer-churn", methodAndHeader);
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(errorMessage);
        } else {
          const data = await response.json();
          console.log("data customer churn:", data);
          // Get Churn count
          for (const loop of data) {
            console.log(loop);
            if (loop["churn"] === "Churn") {
              console.log("loop count churn:", loop["count"]);
              setCustomerChurn((prevState) => ({
                ...prevState,
                churnCount: loop["count"],
              }));
            } else if (loop["churn"] === "Not Churn") {
              console.log("loop count not churn:", loop["count"]);
              setCustomerChurn((prevState) => ({
                ...prevState,
                notChurnCount: loop["count"],
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
    if (session) fetchCustomerChurn();
  }, [session]);

  const donutApexChart = {
    series: [customerChurn.churnCount, customerChurn.notChurnCount], // set the data from customerChurn count
    options: {
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
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: {
              fontSize: "17px",
              labels: {
                colors: ["#ffffff", "#ffffff"],
              },
              position: "top",
            },
          },
        },
      ],
      legend: {
        fontSize: "17px",
        labels: {
          colors: ["#ffffff", "#ffffff"],
        },
      },
      labels: ["Churn", "Not Churn"],
    },
  };

  return (
    <Flex flex="1" padding="1.5rem" backgroundColor="#1c2e45" rounded="0.7rem" minWidth={{ base: "100%", xl: "calc(50% - 2rem)" }} w="100%" minH="10rem" flexDirection="column" alignItems="center" gap="1rem">
      <Text fontSize="lg" fontWeight="medium">
        Customer Churn Prediction
      </Text>

      <Box width="100%">
        {/* Fetching the API */}
        {isLoading === true && (
          <Center>
            <CircularProgress isIndeterminate color="green.300" marginBottom="0.5rem" />
          </Center>
        )}

        {/* Show Customer Churn */}
        {customerChurnPredictionStatus.status !== "processing" && isLoading === false && (
          <>
            <ApexChart options={donutApexChart.options} series={donutApexChart.series} type="donut" width={"100%"} height="250" />
          </>
        )}
      </Box>
    </Flex>
  );
};

export default CustomerChurn;

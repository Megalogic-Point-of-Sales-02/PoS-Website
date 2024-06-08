"use client";

import { Center, CircularProgress, Flex, Spacer, Button, Text, Avatar } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";

const ProfilePage = () => {
  const { data: session } = useSession();

  return (
    <div>
      {/* Fetching the Session */}
      {!session ? (
        <>
          <Center>
            <CircularProgress isIndeterminate color="green.300" marginTop="3rem" />
          </Center>
        </>
      ) : (
        <>
          {/* Table */}
          <Flex flexDirection="column" rounded="1rem" bgColor="#132337" padding="1.5rem" gap="0.5rem" margin="1rem" alignItems="center">
            <Avatar size={"xl"} />
            <Text>{session.user.fullname}</Text>
            <Text>Username: {session.user.username}</Text>
            <Text>Email: {session.user.email}</Text>
          </Flex>
        </>
      )}
    </div>
  );
};

export default ProfilePage;

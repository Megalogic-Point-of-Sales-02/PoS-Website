"use client";

import React, { ReactNode } from "react";
import { IconButton, Avatar, Box, CloseButton, Flex, HStack, VStack, Icon, Link, Drawer, DrawerContent, Text, useDisclosure, BoxProps, FlexProps, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { FiHome, FiMenu, FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { IoPeopleOutline, IoCartOutline } from "react-icons/io5";
import { AiOutlineInbox } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface LinkItemProps {
  name: string;
  icon: IconType;
  endpoint: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiHome, endpoint: "/" },
  { name: "Customers", icon: IoPeopleOutline, endpoint: "/customers" },
  { name: "Products", icon: AiOutlineInbox, endpoint: "/products" },
  { name: "Orders", icon: IoCartOutline, endpoint: "/orders" },
];

export default function SidebarWithHeader({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg="#0f1824" color="white">
      <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
      <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <Box transition="3s ease" bg="#132337" borderRight="2px" borderRightColor="#1c2e45" w={{ base: "full", md: 60 }} pos="fixed" h="full" {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Link href="/" style={{ textDecoration: "none" }}>
          <Text fontSize="2xl" fontWeight="bold" color={"white"}>
            Megalogic PoS
          </Text>
        </Link>
        <CloseButton display={{ base: "flex", md: "none" }} bgColor={"white"} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} endpoint={link.endpoint} isActive={pathname === link.endpoint} color={"white"}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  endpoint: string;
  isActive: boolean;
  children: ReactText;
}
const NavItem = ({ icon, endpoint, isActive, children, ...rest }: NavItemProps) => {
  return (
    <Link href={endpoint} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? "#1c2e45" : "transparent"} // Set background color if endpoint matches
        _hover={{
          bg: "#1c2e45",
          color: "white",
        }}
        transition="all 0.2s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            color={isActive ? "#3b82f6" : "#92afd3"}
            _groupHover={{
              color: "white",
            }}
            as={icon}
            transition="all 0.2s ease"
          />
        )}
        <Text color={isActive ? "#3b82f6" : "#92afd3"} _groupHover={{ color: "white" }} transition="all 0.2s ease">
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { data: session, status } = useSession();
  const { push } = useRouter();

  return (
    <Flex ml={{ base: 0, md: 60 }} px={{ base: 4, md: 4 }} height="4rem" alignItems="center" bg="#132337" borderBottomWidth="1px" borderBottomColor="#132337" justifyContent={{ base: "space-between", md: "flex-end" }} {...rest}>
      <IconButton display={{ base: "flex", md: "none" }} onClick={onOpen} bgColor="#white" aria-label="open menu" icon={<FiMenu />} />

      <Link href="/" style={{ textDecoration: "none" }}>
        <Text display={{ base: "flex", md: "none" }} fontSize="2xl" fontWeight="bold" color="white">
          Megalogic PoS
        </Text>
      </Link>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
              <HStack>
                <Avatar size={"sm"} />
                <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                  {session ? <Text fontSize="sm">{session?.user.username}</Text> : <Text fontSize="sm">Load username...</Text>}
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg="#132337" borderColor="#0f1824">
              <MenuItem bg="#132337" onClick={() => push("/profile")}>
                Profile
              </MenuItem>
              <MenuDivider borderColor="#1c2e45" />
              <MenuItem bg="#132337" onClick={() => push("/api/auth/signout")}>
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

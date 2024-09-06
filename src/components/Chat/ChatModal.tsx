'use client';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FC } from 'react';
import { BiChat } from 'react-icons/bi';
import { Chat } from './Chat';

export const ChatModal: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        position="fixed"
        bottom="20px"
        rounded="full"
        right="20px"
        width="56px"
        height="56px"
        p={0}
        colorScheme="blue"
        onClick={onOpen}
      >
        <BiChat size="32px" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          position="fixed"
          bottom="70px"
          right="20px"
          margin="0"
          width="400px"
          maxHeight="600px"
        >
          <ModalHeader>Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Chat />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

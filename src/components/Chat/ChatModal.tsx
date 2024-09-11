'use client';
import { useClientContext } from '@/context/ClientContext';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FC } from 'react';
import { BiChat } from 'react-icons/bi';
import { Chat } from './Chat';

export const ChatModal: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { clients } = useClientContext();

  return (
    <>
      {clients !== undefined && clients.length > 0 && (
        <Button
          position="fixed"
          bottom="20px"
          rounded="full"
          right="20px"
          width="56px"
          height="56px"
          p={0}
          colorScheme="primary"
          onClick={onOpen}
        >
          <BiChat size="32px" />
        </Button>
      )}

      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropBlur="2px" />
        <ModalContent position="fixed" bottom="70px" right="20px">
          <ModalHeader>AI Assistant</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Chat />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

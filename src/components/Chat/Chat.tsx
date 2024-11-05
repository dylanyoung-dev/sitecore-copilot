'use client';
import { ClientData, useClientContext } from '@/context/ClientContext';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../CodeBlock/CodeBlock';

interface Message {
  sender: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  messages?: Message[];
}

export const Chat: FC<ChatProps> = () => {
  const { clients } = useClientContext();
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatResponse = (response: string): string => {
    return response.trim();
  };

  const onClick = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, messages, clients }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Message sent:', data);

      setMessages([
        ...messages,
        { sender: 'user', content: message },
        { sender: 'assistant', content: formatResponse(data.message) },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setLoading(false);
    setMessage('');
  };

  const startNewSession = async () => {};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClick(e);
    }
  };

  return (
    <Flex flexDirection="column" mb={4} p={4} maxHeight="60vh" borderWidth={1} borderRadius="lg">
      {/* <Select
        placeholder="Select a client"
        onChange={(e) => {
          const client = clients.find((client) => client.clientId === e.target.value);
          setSelectedClient(client || null);
        }}
      >
        {clients.map((client: ClientData) => (
          <option key={client.clientId} value={client.clientId}>
            {client.product} - {client.clientId}
          </option>
        ))}
      </Select> */}
      <VStack spacing={4} align="stretch" flex="1" overflowY="auto" pr={2}>
        {messages.map((msg, index) => (
          <HStack
            key={index}
            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            bg={msg.sender === 'user' ? 'gray.500' : 'gray.200'}
            color={msg.sender === 'user' ? 'white' : 'black'}
            p={3}
            borderRadius="md"
          >
            {msg.sender === 'assistant' && <Avatar name="Assistant" src="/path/to/avatar.png" mr={2} />}
            <Box>
              {msg.sender === 'assistant' ? (
                <Box p={2}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ node, ...props }) => <Table variant="simple" my={2} {...props} border="1px solid" />,
                      thead: ({ node, ...props }) => <Thead {...props} />,
                      tbody: ({ node, ...props }) => <Tbody {...props} />,
                      tr: ({ node, ...props }) => <Tr {...props}>{props.children}</Tr>,
                      th: ({ node, ...props }) => <Th {...props} />,
                      td: ({ node, ...props }) => <Td {...props} />,
                      code: ({ node, ...props }) => {
                        const language = props.className?.replace('language-', '') || '';
                        return !(props as any).inline ? (
                          <Box my={4}>
                            <CodeBlock code={String(props.children).trim()} language={language} />
                          </Box>
                        ) : (
                          <Text as="code" bg="gray.100" p={1} borderRadius="md" {...props}>
                            {props.children}
                          </Text>
                        );
                      },
                      ol: ({ children }) => (
                        <Box as="ol" pl={4} listStyleType="decimal" my={4}>
                          {children}
                        </Box>
                      ),
                      ul: ({ children }) => (
                        <Box as="ul" pl={4} listStyleType="disc" my={4}>
                          {children}
                        </Box>
                      ),
                      li: ({ children }) => (
                        <Box as="li" mb={2} ml={4}>
                          {children}
                        </Box>
                      ),
                      p: ({ children }) => <Text>{children}</Text>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </Box>
              ) : (
                <Text>{msg.content}</Text>
              )}
            </Box>
          </HStack>
        ))}
        {loading && (
          <HStack alignSelf="center">
            <Progress size="lg" isIndeterminate />
          </HStack>
        )}
        <div ref={messagesEndRef} />
      </VStack>
      <Divider my={4} />
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          isDisabled={loading}
        />
        <HStack>
          <Button onClick={onClick} colorScheme="primary" isLoading={loading}>
            Ask
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
};

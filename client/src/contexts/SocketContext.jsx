// Import necessary dependencies
import { SOCKET_HOST } from "@/lib/constants"; // Import the socket server URL from constants
import { useAppStore } from "@/store"; // Import the global state management store
import React, { createContext, useContext, useEffect, useRef } from "react"; // Import React hooks and context API
import { io } from "socket.io-client"; // Import `socket.io-client` to establish WebSocket connections

// Create a context for managing the WebSocket connection
const SocketContext = createContext(null);

// Custom hook to use the WebSocket context
export const useSocket = () => {
  return useContext(SocketContext); // Returns the socket instance stored in the context
};

// Provider component to manage the WebSocket connection
export const SocketProvider = ({ children }) => {
  const socket = useRef(); // useRef is used to persist the socket instance without re-rendering the component
  const { userInfo } = useAppStore(); // Retrieve `userInfo` (logged-in user data) from the global state

  useEffect(() => {
    // Establish a WebSocket connection only if the user is logged in
    if (userInfo) { 
      socket.current = io(SOCKET_HOST, {
        withCredentials: true, // Allows sending authentication credentials (cookies, headers)
        query: { userId: userInfo.id }, // Sends user ID to the server when connecting
      });

      // Event listener for successful WebSocket connection
      socket.current.on("connect", () => {
        console.log("Connected to socket server"); // Logs a message when connected
      });

      // Event listener for receiving a direct message
      const handleReceiveMessage = (message) => {
        // Get the latest state values from the store
        const {
          selectedChatData: currentChatData, // Currently selected chat
          selectedChatType: currentChatType, // Chat type (direct message or channel)
          addMessage, // Function to add a message to the chat
          addContactInDMContacts, // Function to update the contacts list
        } = useAppStore.getState();

        // Check if the message belongs to the currently open chat
        if (
          currentChatType !== undefined && // Ensure a chat is selected
          (currentChatData._id === message.sender._id || // If sender is the currently selected user
            currentChatData._id === message.recipient._id) // Or recipient is the selected user
        ) {
          addMessage(message); // Add message to the chat
        }

        addContactInDMContacts(message); // Add sender to direct message contacts list
      };

      // Event listener for receiving a message in a channel
      const handleReceiveChannelMessage = (message) => {
        // Get the latest state values from the store
        const {
          selectedChatData, // Currently selected chat data
          selectedChatType, // Chat type (channel or direct)
          addMessage, // Function to add a message
          addChannelInChannelLists, // Function to update the list of channels
        } = useAppStore.getState();

        // Check if the received message belongs to the currently open channel
        if (
          selectedChatType !== undefined && // Ensure a chat is selected
          selectedChatData._id === message.channelId // If the message is from the selected channel
        ) {
          addMessage(message); // Add message to the chat
        }

        addChannelInChannelLists(message); // Update channel list with the latest message
      };

      // Event listener for adding a new channel
      const addNewChannel = (channel) => {
        const { addChannel } = useAppStore.getState(); // Retrieve function to add a channel from the store
        addChannel(channel); // Add new channel to the list
      };

      // Listen for direct messages from the server
      socket.current.on("receiveMessage", handleReceiveMessage);

      // Listen for channel messages from the server
      socket.current.on("recieve-channel-message", handleReceiveChannelMessage);

      // Listen for notifications about new channels being added
      socket.current.on("new-channel-added", addNewChannel);

      // Cleanup function: disconnects the socket when the component unmounts or `userInfo` changes
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]); // Dependency array: runs effect when `userInfo` changes

  return (
    // Provide the socket instance to all child components
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider; // Export the provider for use in the application

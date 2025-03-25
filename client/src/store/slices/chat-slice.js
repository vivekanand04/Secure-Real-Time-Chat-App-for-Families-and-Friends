// Exporting a function `createChatSlice` which initializes and manages the chat state.
// `set` is used to update the state, and `get` is used to retrieve the current state.
export const createChatSlice = (set, get) => ({
  // Stores the type of the selected chat (e.g., "direct message" or "channel").
  selectedChatType: undefined,

  // Stores data related to the currently selected chat (e.g., user details in a DM or channel info).
  selectedChatData: undefined,

  // Stores messages for the selected chat.
  selectedChatMessages: [],

  // Stores a list of direct messaging contacts.
  directMessagesContacts: [],

  // Stores a list of available channels.
  channels: [],

  // Boolean flag to track whether a file is being uploaded.
  isUploading: false,

  // Tracks the file upload progress percentage.
  fileUploadProgress: 0,

  // Boolean flag to track whether a file is being downloaded.
  isDownloading: false,

  // Tracks the file download progress percentage.
  downloadProgress: 0,

  // Function to update `isUploading` state.
  setIsUploading: (isUploading) => set({ isUploading }),

  // Function to update `fileUploadProgress` state.
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),

  // Function to update `isDownloading` state.
  setIsDownloading: (isDownloading) => set({ isDownloading }),

  // Function to update `downloadProgress` state.
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),

  // Function to update `selectedChatType` (e.g., "direct" or "channel").
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  // Function to update `selectedChatData` with details of the selected chat.
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  // Function to update the list of channels.
  setChannels: (channels) => set({ channels }),

  // Function to update messages in the selected chat.
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),

  // Function to update the list of direct message contacts.
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),

  // Function to close the current chat by resetting chat-related states.
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),

  // Function to add a new message to the selected chat.
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages; // Get current chat messages
    const selectedChatType = get().selectedChatType; // Get the current chat type

    // Add the new message to the existing messages list with adjusted sender/recipient fields.
    set({
      selectedChatMessages: [
        ...selectedChatMessages, // Keep existing messages
        {
          ...message, // Spread message properties
          recipient:
            selectedChatType === "channel"
              ? message.recipent // In a channel, use `message.recipent` (possible typo, should be `recipient`)
              : message.recipient._id, // In DM, store recipient's ID
          sender:
            selectedChatType === "channel"
              ? message.sender // In a channel, store sender as is
              : message.sender._id, // In DM, store sender's ID
        },
      ],
    });
  },

  // Function to add a new channel to the list of channels.
  addChannel: (channel) => {
    const channels = get().channels; // Get current channels
    set({ channels: [channel, ...channels] }); // Add the new channel at the beginning of the list
  },

  // Function to add/update a contact in the direct messages contact list.
  addContactInDMContacts: (message) => {
    console.log({ message });

    const userId = get().userInfo.id; // Get the current user's ID

    // Determine the sender and recipient for the message
    const fromId =
      message.sender._id === userId
        ? message.recipient._id // If the sender is the current user, get the recipient's ID
        : message.sender._id; // Otherwise, get the sender's ID

    const fromData =
      message.sender._id === userId ? message.recipient : message.sender; // Get the sender/recipient data

    const dmContacts = get().directMessagesContacts; // Get the current DM contacts list
    const data = dmContacts.find((contact) => contact._id === fromId); // Check if the contact already exists
    const index = dmContacts.findIndex((contact) => contact._id === fromId); // Get the index of the contact in the list

    console.log({ data, index, dmContacts, userId, message, fromData });

    if (index !== -1 && index !== undefined) {
      console.log("in if condition");
      dmContacts.splice(index, 1); // Remove the contact from its current position
      dmContacts.unshift(data); // Move the contact to the top of the list
    } else {
      console.log("in else condition");
      dmContacts.unshift(fromData); // Add the new contact to the top of the list
    }

    set({ directMessagesContacts: dmContacts }); // Update the state with the modified contacts list
  },

  // Function to update the order of channels when a message is received.
  addChannelInChannelLists: (message) => {
    const channels = get().channels; // Get the current list of channels

    // Find the channel that matches the message's channel ID
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );

    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1); // Remove the channel from its current position
      channels.unshift(data); // Move the channel to the top of the list
    }
  },
});
   



// export const createChatSlice = (set, get) => ({
//   selectedChatType: undefined,
//   selectedChatData: undefined,
//   selectedChatMessages: [],
//   directMessagesContacts: [],
//   channels: [],
//   isUploading: false,
//   fileUploadProgress: 0,
//   isDownloading: false,
//   downloadProgress: 0,
//   setIsUploading: (isUploading) => set({ isUploading }),
//   setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
//   setIsDownloading: (isDownloading) => set({ isDownloading }),
//   setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
//   setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
//   setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
//   setChannels: (channels) => set({ channels }),
//   setSelectedChatMessages: (selectedChatMessages) =>
//     set({ selectedChatMessages }),
//   setDirectMessagesContacts: (directMessagesContacts) =>
//     set({ directMessagesContacts }),
//   closeChat: () =>
//     set({
//       selectedChatData: undefined,
//       selectedChatType: undefined,
//       selectedChatMessages: [],
//     }),
//   addMessage: (message) => {
//     const selectedChatMessages = get().selectedChatMessages;
//     const selectedChatType = get().selectedChatType;
//     set({
//       selectedChatMessages: [
//         ...selectedChatMessages,
//         {
//           ...message,
//           recipient:
//             selectedChatType === "channel"
//               ? message.recipent
//               : message.recipient._id,
//           sender:
//             selectedChatType === "channel"
//               ? message.sender
//               : message.sender._id,
//         },
//       ],
//     });
//   },
//   addChannel: (channel) => {
//     const channels = get().channels;
//     set({ channels: [channel, ...channels] });
//   },
//   addContactInDMContacts: (message) => {
//     console.log({ message });
//     const userId = get().userInfo.id;
//     const fromId =
//       message.sender._id === userId
//         ? message.recipient._id
//         : message.sender._id;
//     const fromData =
//       message.sender._id === userId ? message.recipient : message.sender;
//     const dmContacts = get().directMessagesContacts;
//     const data = dmContacts.find((contact) => contact._id === fromId);
//     const index = dmContacts.findIndex((contact) => contact._id === fromId);
//     console.log({ data, index, dmContacts, userId, message, fromData });
//     if (index !== -1 && index !== undefined) {
//       console.log("in if condition");
//       dmContacts.splice(index, 1);
//       dmContacts.unshift(data);
//     } else {
//       console.log("in else condition");
//       dmContacts.unshift(fromData);
//     }
//     set({ directMessagesContacts: dmContacts });
//   },
//   addChannelInChannelLists: (message) => {
//     const channels = get().channels;
//     const data = channels.find((channel) => channel._id === message.channelId);
//     const index = channels.findIndex(
//       (channel) => channel._id === message.channelId
//     );
//     if (index !== -1 && index !== undefined) {
//       channels.splice(index, 1);
//       channels.unshift(data);
//     }
//   },
// });

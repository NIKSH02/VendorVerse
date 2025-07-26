import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { accessToken } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [activeChats, setActiveChats] = useState(new Map());

    useEffect(() => {
        if (!accessToken) return;

        const newSocket = io('http://localhost:8000', {
            auth: { token: accessToken }
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [accessToken]);

    const joinChat = useCallback((chatId) => {
        if (!socket || !chatId) return;
        socket.emit('joinChat', chatId);
    }, [socket]);

    const leaveChat = useCallback((chatId) => {
        if (!socket || !chatId) return;
        socket.emit('leaveChat', chatId);
    }, [socket]);

    const sendMessage = useCallback((chatId, content, type = 'text', buttons = []) => {
        if (!socket || !chatId) return;
        socket.emit('sendMessage', { chatId, content, type, buttons });
    }, [socket]);

    const sendTypingStatus = useCallback((chatId, isTyping) => {
        if (!socket || !chatId) return;
        socket.emit('typing', { chatId, isTyping });
    }, [socket]);

    const value = {
        socket,
        isConnected,
        joinChat,
        leaveChat,
        sendMessage,
        sendTypingStatus,
        activeChats
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

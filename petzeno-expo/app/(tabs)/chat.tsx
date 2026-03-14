import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard } from 'react-native';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import { LinearGradient } from "expo-linear-gradient";
import { getApiUrl } from '@/lib/query-client';
import Colors from "@/constants/colors";



const INITIAL_MESSAGES = [
  {
    id: '1',
    text: "Hi there! 👋 I'm your Petzeno AI Assistant powered by Gemini. How can I help you and Max today? You can ask me about symptoms, diet, or general care.",
    sender: 'ai',
  }
];

export default function AIHealthChatScreen() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Use the Custom Express API dynamically
      const baseUrl = getApiUrl();
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      
      if (!response.ok) throw new Error('API failed');

      const result = await response.json();
      const responseText = result.text;
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch(err) {
      console.error("Backend Chat Error:", err);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "I couldn't reach the AI servers. Please ensure your Firebase functions are deployed and running.",
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primaryLight1, '#F8FAFD']} 
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleGroup}>
            <Sparkles size={20} color="#FFD56B" />
            <Text style={styles.headerTitle}>AI Health Assistant</Text>
          </View>
          <Text style={styles.headerSub}>Powered by Gemini</Text>
        </View>

      <ScrollView 
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            This AI assistant provides general guidance. It is not a substitute for professional veterinary advice.
          </Text>
        </View>

        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageWrapper, 
              msg.sender === 'user' ? styles.messageWrapperUser : styles.messageWrapperAi
            ]}
          >
            {msg.sender === 'ai' && (
              <View style={styles.avatarAi}>
                <Bot size={16} color="#FFFFFF" />
              </View>
            )}
            
            <View 
              style={[
                styles.messageBubble, 
                msg.sender === 'user' ? styles.messageBubbleUser : styles.messageBubbleAi
              ]}
            >
              <Text style={[styles.messageText, msg.sender === 'user' ? styles.messageTextUser : styles.messageTextAi]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageWrapper, styles.messageWrapperAi]}>
            <View style={styles.avatarAi}>
              <Bot size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.messageBubble, styles.messageBubbleAi, styles.typingBubble]}>
              <ActivityIndicator size="small" color="#FF7B54" />
              <Text style={styles.typingText}>Gemini is typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

        <View style={[
          styles.inputArea,
          // When keyboard is visible, remove the extra bottom padding so it hugs the keyboard
          isKeyboardVisible && { paddingBottom: Platform.OS === 'ios' ? 16 : 16 }
        ]}>
          <TextInput 
            style={styles.input}
            placeholder="Ask a health question..."
            placeholderTextColor="#A0AEC0"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#FFFFFF" style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
  headerSub: { fontSize: 12, color: '#718096', fontWeight: '500' },
  chatArea: { flex: 1, paddingHorizontal: 16 },
  chatContent: { paddingVertical: 20, paddingBottom: 40 },
  disclaimerBox: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  disclaimerText: { fontSize: 12, color: '#C53030', textAlign: 'center', lineHeight: 18 },
  messageWrapper: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end', maxWidth: '85%' },
  messageWrapperUser: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  messageWrapperAi: { alignSelf: 'flex-start' },
  avatarAi: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF7B54',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  messageBubbleUser: { backgroundColor: '#4A90E2', borderBottomRightRadius: 4 },
  messageBubbleAi: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTextUser: { color: '#FFFFFF' },
  messageTextAi: { color: '#2D3748' },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14 },
  typingText: { fontSize: 13, color: '#718096', fontStyle: 'italic' },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    maxHeight: 100,
    fontSize: 15,
    color: '#1A202C',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF7B54',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  sendBtnDisabled: { backgroundColor: '#CBD5E0' },
  sendIcon: { marginLeft: 2 }, // Visual center tweak
});

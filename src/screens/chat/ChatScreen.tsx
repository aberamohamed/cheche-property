import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "../../components/Screen";
import { colors, radius, spacing } from "../../utils/theme";
import { Message, Property } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { mockPropertiesApi } from "../../services/mockDb";
import { LoadingState } from "../../components/LoadingState";
import { useMinimumDisplay } from "../../hooks/useMinimumDisplay";

const initialMessages: Message[] = [
  {
    id: "msg-001",
    sender: "agent",
    text: "Hi! I can help answer questions about the listing or schedule a viewing.",
    timestamp: new Date().toISOString()
  }
];

export const ChatScreen = () => {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const token = useAuthStore((state) => state.token);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Message>>(null);
  const [text, setText] = useState("");

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => (propertyId ? mockPropertiesApi.getById(propertyId) : null),
    enabled: !!propertyId
  });
  const showLoading = useMinimumDisplay(isLoading, 3000);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (property) {
      setMessages([
        {
          id: "msg-001",
          sender: "agent",
          text: `Hi! I'm ${property.agentName}, the broker for ${property.title}. How can I help you today?`,
          timestamp: new Date().toISOString()
        }
      ]);
    } else {
      setMessages([
        {
          id: "msg-001",
          sender: "agent",
          text: "Hi! I can help answer questions about our listings or schedule a viewing.",
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [property]);

  // Approximate header height if transparent
  const headerHeight = Platform.OS === "ios" ? 44 + insets.top : 56 + insets.top;

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (propertyId && showLoading) {
    return <LoadingState />;
  }

  const send = () => {
    if (!text.trim()) return;

    const outbound: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((current) => [...current, outbound]);
    setText("");

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `msg-${Date.now()}-reply`,
          sender: "agent",
          text: "Thanks. I’ll pass this along and follow up shortly.",
          timestamp: new Date().toISOString()
        }
      ]);
    }, 1200);
  };

  const renderHeader = () => {
    const name = property?.agentName || "Assistant";
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
      <View style={[styles.header, { paddingTop: headerHeight + spacing.lg }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.onlineBadge} />
          </View>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.subtitle}>
            {property ? `Listing Agent for ${property.title}` : "Fast replies with a premium experience."}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Screen scrollable={false} horizontalPadding={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messages,
            { paddingBottom: spacing.xl }
          ]}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => {
            const isUser = item.sender === "user";
            return (
              <View
                style={[
                  styles.bubbleContainer,
                  isUser ? styles.userBubbleContainer : styles.agentBubbleContainer
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.agentBubble
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isUser ? styles.userBubbleText : styles.agentBubbleText
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.agentTimeText]}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <View style={[styles.composerContainer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <View style={styles.composer}>
            <TextInput
              placeholder="Write a message..."
              placeholderTextColor={colors.textSoft}
              value={text}
              onChangeText={setText}
              style={styles.input}
              multiline
            />
            <Pressable 
              onPress={send} 
              style={({ pressed }) => [
                styles.sendButton,
                { opacity: pressed || !text.trim() ? 0.7 : 1 }
              ]}
              disabled={!text.trim()}
            >
              <Ionicons name="send" color="#FFFFFF" size={20} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceMuted
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: "center"
  },
  headerContent: {
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.xl,
    width: '100%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981', // green-500
    borderWidth: 2,
    borderColor: colors.surface
  },
  headerIcon: {
    marginBottom: spacing.sm
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center"
  },
  messages: {
    paddingHorizontal: spacing.lg
  },
  bubbleContainer: {
    marginBottom: spacing.md,
    width: "100%"
  },
  userBubbleContainer: {
    alignItems: "flex-end"
  },
  agentBubbleContainer: {
    alignItems: "flex-start"
  },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    shadowColor: "rgba(0,0,0,0.03)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4
  },
  agentBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500"
  },
  userBubbleText: {
    color: "#FFFFFF"
  },
  agentBubbleText: {
    color: colors.text
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500"
  },
  userTimeText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right"
  },
  agentTimeText: {
    color: colors.textSoft,
    textAlign: "left"
  },
  composerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  }
});

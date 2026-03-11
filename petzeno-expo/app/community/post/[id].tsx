import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCommunity } from "@/context/CommunityContext";
import Colors from "@/constants/colors";

function formatTime(isoString: string) {
  const d = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const { posts, toggleLike, addComment } = useCommunity();
  const [comment, setComment] = useState("");
  const currentUserId = "current_user";

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Post not found</Text>
      </View>
    );
  }

  const isLiked = post.likes.includes(currentUserId);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addComment(post.id, {
      userId: currentUserId,
      userName: "You",
      userAvatar: "🐾",
      text: comment.trim(),
    });
    setComment("");
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post */}
        <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
          <View style={styles.postHeader}>
            <View style={[styles.authorAvatar, { backgroundColor: Colors.primaryLight }]}>
              <Text style={styles.avatarEmoji}>{post.userAvatar}</Text>
            </View>
            <View>
              <Text style={[styles.authorName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {post.userName}
              </Text>
              <Text style={[styles.postTime, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                {post.petName} • {formatTime(post.timestamp)}
              </Text>
            </View>
          </View>
          <Text style={[styles.postContent, { color: colors.text, fontFamily: "Inter_400Regular" }]}>
            {post.content}
          </Text>
          <View style={[styles.postActions, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={styles.action}
              onPress={() => {
                toggleLike(post.id, currentUserId);
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? Colors.emergency : colors.textSecondary} />
              <Text style={[styles.actionCount, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
                {post.likes.length} likes
              </Text>
            </TouchableOpacity>
            <View style={styles.action}>
              <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.actionCount, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
                {post.comments.length} comments
              </Text>
            </View>
          </View>
        </View>

        {/* Comments */}
        <Text style={[styles.commentsTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Comments ({post.comments.length})
        </Text>
        {post.comments.length === 0 ? (
          <Text style={[styles.noComments, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
            No comments yet. Be the first to comment!
          </Text>
        ) : (
          post.comments.map((cmt) => (
            <View key={cmt.id} style={[styles.commentCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.commentAvatar, { backgroundColor: Colors.primaryLight }]}>
                <Text style={styles.commentEmoji}>{cmt.userAvatar}</Text>
              </View>
              <View style={styles.commentContent}>
                <View style={[styles.commentBubble, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={[styles.commentAuthor, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {cmt.userName}
                  </Text>
                  <Text style={[styles.commentText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    {cmt.text}
                  </Text>
                </View>
                <Text style={[styles.commentTime, { color: colors.textTertiary, fontFamily: "Inter_400Regular" }]}>
                  {formatTime(cmt.timestamp)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Comment Input */}
      <View style={[styles.commentInputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.commentInput, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
          value={comment}
          onChangeText={setComment}
          placeholder="Write a comment..."
          placeholderTextColor={colors.textTertiary}
          returnKeyType="send"
          onSubmitEditing={handleAddComment}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: comment.trim() ? Colors.primary : colors.surfaceSecondary }]}
          onPress={handleAddComment}
          disabled={!comment.trim()}
        >
          <Ionicons name="send" size={18} color={comment.trim() ? "#fff" : colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 16, gap: 12, paddingBottom: 100 },
  postCard: {
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  postHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  authorAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 22 },
  authorName: { fontSize: 15 },
  postTime: { fontSize: 12, marginTop: 2 },
  postContent: { fontSize: 15, lineHeight: 22, marginBottom: 12 },
  postActions: { flexDirection: "row", gap: 20, paddingTop: 10, borderTopWidth: 1 },
  action: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionCount: { fontSize: 14 },
  commentsTitle: { fontSize: 17 },
  noComments: { fontSize: 14, textAlign: "center", paddingVertical: 20 },
  commentCard: {
    flexDirection: "row",
    gap: 8,
    borderRadius: 12,
    padding: 8,
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  commentEmoji: { fontSize: 18 },
  commentContent: { flex: 1, gap: 4 },
  commentBubble: { borderRadius: 12, padding: 10, gap: 2 },
  commentAuthor: { fontSize: 13 },
  commentText: { fontSize: 13, lineHeight: 18 },
  commentTime: { fontSize: 11, paddingLeft: 10 },
  commentInputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    paddingBottom: Platform.OS === "web" ? 34 : 20,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

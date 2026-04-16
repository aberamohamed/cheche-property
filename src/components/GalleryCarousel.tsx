import { useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { colors, radius, spacing } from "../utils/theme";
import { AgentBadge } from "./AgentBadge";

interface GalleryCarouselProps {
  images: string[];
  agentName?: string;
}

export const GalleryCarousel = ({ images, agentName }: GalleryCarouselProps) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = useMemo(() => width - 40, [width]);

  return (
    <View style={styles.container}>
      <FlatList
        data={images || []}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        pagingEnabled={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={cardWidth + spacing.sm}
        decelerationRate="fast"
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (cardWidth + spacing.sm));
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: cardWidth }]}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
      />
      {agentName ? (
        <AgentBadge
          name={agentName}
          compact
          style={styles.agentBadge}
        />
      ) : null}
      <View style={styles.dots}>
        {(images || []).map((_, index) => (
          <View key={index} style={[styles.dot, activeIndex === index ? styles.dotActive : null]} />
        ))}
      </View>
      <Text style={styles.counter}>
        {activeIndex + 1}/{(images || []).length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative"
  },
  listContent: {
    paddingHorizontal: 20
  },
  slide: {
    marginRight: spacing.sm
  },
  image: {
    height: 300,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceMuted
  },
  agentBadge: {
    position: "absolute",
    left: 14,
    bottom: 18
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginTop: spacing.sm
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.18)"
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary
  },
  counter: {
    position: "absolute",
    right: 14,
    bottom: 14,
    color: "#FFFFFF",
    backgroundColor: "rgba(15,23,42,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700"
  }
});

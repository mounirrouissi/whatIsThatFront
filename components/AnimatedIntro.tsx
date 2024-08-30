import React, { memo } from 'react';
import { StyleSheet, useWindowDimensions, View, SafeAreaView } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { FontAwesome5 } from '@expo/vector-icons';

const content = [
  {
    title: "Identify Animals",
    bg: '#FF6B6B',
    fontColor: '#FFFFFF',
    icon: 'paw',
  },
  {
    title: "Identify Plants",
    bg: '#4ECDC4',
    fontColor: '#FFFFFF',
    icon: 'leaf',
  },
  {
    title: "Identify Bugs",
    bg: '#45B7D1',
    fontColor: '#FFFFFF',
    icon: 'bug',
  },
  {
    title: "Identify Mushrooms",
    bg: '#F7B731',
    fontColor: '#FFFFFF',
    icon: 'seedling',
  },
  {
    title: "Identify Coins",
    bg: '#5D5D5D',
    fontColor: '#FFFFFF',
    icon: 'coins',
  },
  {
    title: "Identify Stones",
    bg: '#A67C52',
    fontColor: '#FFFFFF',
    icon: 'gem',
  },
  {
    title: "Identify Birds",
    bg: '#26A65B',
    fontColor: '#FFFFFF',
    icon: 'dove',
  },
  {
    title: "And More...",
    bg: '#3498DB',
    fontColor: '#FFFFFF',
    icon: 'ellipsis-h',
  },
];

const AnimatedIntro = () => {
  const { width, height } = useWindowDimensions();
  const ballWidth = 60;
  const half = width / 2 - ballWidth / 2;

  const currentX = useSharedValue(half);
  const currentIndex = useSharedValue(0);
  const isAtStart = useSharedValue(true);
  const labelWidth = useSharedValue(0);
  const canGoToNext = useSharedValue(false);

  const newColorIndex = useDerivedValue(() => {
    if (!isAtStart.value) {
      return (currentIndex.value + 1) % content.length;
    }
    return currentIndex.value;
  }, [currentIndex]);

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        currentX.value,
        [half, half + labelWidth.value / 2],
        [content[newColorIndex.value].fontColor, content[currentIndex.value].fontColor],
        'RGB'
      ),
      transform: [
        {
          translateX: half + 4,
        },
      ],
    };
  }, [currentIndex, currentX, labelWidth]);

  const ballStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        currentX.value,
        [half, half + labelWidth.value / 2],
        [content[newColorIndex.value].fontColor, content[currentIndex.value].fontColor],
        'RGB'
      ),
      transform: [{ translateX: currentX.value }],
    };
  }, [currentIndex, currentX, labelWidth]);

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      currentX.value,
      [half, half + labelWidth.value / 2],
      [content[newColorIndex.value].bg, content[currentIndex.value].bg],
      'RGB'
    ),
  }), [currentIndex, currentX, labelWidth]);

  const text = useDerivedValue(() => {
    const index = currentIndex.value;
    return content[index].title;
  }, [currentIndex]);

  const icon = useDerivedValue(() => {
    const index = currentIndex.value;
    return content[index].icon;
  }, [currentIndex]);

  useAnimatedReaction(
    () => labelWidth.value,
    (newWidth) => {
      if (newWidth > 0) {
        currentX.value = withDelay(
          1000,
          withTiming(
            half + newWidth / 2,
            {
              duration: 800,
            },
            (finished) => {
              if (finished) {
                canGoToNext.value = true;
                isAtStart.value = false;
              }
            }
          )
        );
      }
    },
    [labelWidth, currentX, half]
  );

  useAnimatedReaction(
    () => canGoToNext.value,
    (next) => {
      if (next) {
        canGoToNext.value = false;
        currentX.value = withDelay(
          1000,
          withTiming(
            half,
            {
              duration: 800,
            },
            (finished) => {
              if (finished) {
                currentIndex.value = (currentIndex.value + 1) % content.length;
                isAtStart.value = true;
              }
            }
          )
        );
      }
    },
    [currentX, labelWidth]
  );

  const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.wrapper, backgroundStyle]}>
        <View style={styles.container}>
          <Animated.View style={[styles.content, {alignItems: 'center', justifyContent: 'center'}]}>
            <Animated.View style={[styles.ball, ballStyle, {position: 'relative'}]}>
              <AnimatedIcon name={icon} size={30} color={content[currentIndex.value].bg} />
            </Animated.View>
            <ReText
              onLayout={(e) => {
                labelWidth.value = e.nativeEvent.layout.width + 4;
              }}
              style={[styles.title, textStyle, {position: 'relative'}]}
              text={text}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0.5, 

  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  
    justifyContent: 'center',
  },
  ball: {
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(AnimatedIntro);
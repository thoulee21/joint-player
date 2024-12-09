import React, { useRef, useState } from 'react';
import { Image, View, type StyleProp, type ViewStyle } from 'react-native';

import { baseAspectRatio, type AspectRatio } from '../constants/sizes';
import { ImageBlurProvider } from '../contexts/ImageBlurContext';
import { getImageSource } from '../utils/image';

import ImageBlurShape, { type ImageBlurShapeProps } from './ImageBlurShape';

import styles from './ImageBlur.styles';

type ImageBlurContainerSize = {
  height: number | undefined;
  width: number | undefined;
};

export type ImageBlurRadius = number;

export type ImageBlurProps = {
  aspectRatio?: AspectRatio;
  style?: StyleProp<ViewStyle>;
  blurChildren: ImageBlurShapeProps['children'];
  children?: React.ReactNode;
  resizeMode?: ImageBlurShapeProps['resizeMode'];
  src: string;
};

const ImageBlur = ({
  aspectRatio,
  style,
  blurChildren,
  children,
  resizeMode = 'contain',
  src,
}: ImageBlurProps) => {
  const [containerSize, setContainerSize] = useState<ImageBlurContainerSize>({
    height: undefined,
    width: undefined,
  });

  const containerRef = useRef<View | null>(null);

  return (
    <View
      onLayout={({ nativeEvent }) => {
        setContainerSize({
          width: nativeEvent.layout.width,
          height: nativeEvent.layout.height,
        });
      }}
      style={[
        styles.container,
        aspectRatio && {
          aspectRatio:
            typeof aspectRatio === 'number'
              ? aspectRatio
              : baseAspectRatio[aspectRatio],
        },
        style,
      ]}
    >
      <Image
        style={[styles.sticked, styles.fitAvailableSpace]}
        resizeMode={resizeMode}
        source={getImageSource(src)}
      />
      {children}

      {containerSize.height && containerSize.width && (
        <View
          ref={containerRef}
          style={[styles.sticked, styles.fitAvailableSpace]}
        >
          <ImageBlurProvider>
            <ImageBlurShape
              containerRef={containerRef}
              image={{
                height: containerSize.height,
                src,
                width: containerSize.width,
              }}
              resizeMode={resizeMode}
            >
              {blurChildren}
            </ImageBlurShape>
          </ImageBlurProvider>
        </View>
      )}
    </View>
  );
};

export default ImageBlur;

import {Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

const CustomButton = ({onPress,disabled, text, type = 'PRIMARY', bgColor, fgColor}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {},
      ]}>
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? {color: fgColor} : {},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,

    alignItems: 'center',
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: '#FF7F00',
  },
  container_SECONDARY: {
    borderColor: '#FF7F00',
    borderWidth: 2,
  },

  container_TERTIARY: {},
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
  text_PRIMARY: {},
  text_SECONDARY: {
    color: '#FF7F00',
  },
  text_TERTIARY: {},
});

export default CustomButton;

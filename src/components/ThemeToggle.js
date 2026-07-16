import React from 'react';
import { Pressable } from 'react-native';
import { MotiView } from 'moti';
import Svg, { Path } from 'react-native-svg';
import { useColorScheme } from 'nativewind';

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable 
      onPress={toggleColorScheme} 
      className="ml-4 w-10 h-10 rounded-full bg-black items-center justify-center overflow-hidden"
    >
      {/* Outer Path (Rotates 0 -> 180) */}
      <MotiView
        animate={{ rotate: isDark ? '180deg' : '0deg' }}
        transition={{ type: 'timing', duration: 350 }}
        style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <Svg viewBox="0 0 240 240" width="70%" height="70%" fill="none">
          <Path
            d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
            fill="white"
          />
        </Svg>
      </MotiView>

      {/* Inner Shapes (Rotates 0 -> -180) */}
      <MotiView
        animate={{ rotate: isDark ? '-180deg' : '0deg' }}
        transition={{ type: 'timing', duration: 350 }}
        style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <Svg viewBox="0 0 240 240" width="70%" height="70%" fill="none">
          <Path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill="white"
          />
          <Path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="black"
          />
        </Svg>
      </MotiView>
    </Pressable>
  );
}

import React from 'react';
import { Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Sun, Moon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable onPress={toggleColorScheme} className="ml-4">
      <MotiView
        from={{ rotate: '0deg', scale: 1 }}
        animate={{ 
          rotate: isDark ? '180deg' : '0deg',
          scale: isDark ? 1.1 : 1 
        }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-10 h-10 rounded-full items-center justify-center bg-blue-100 dark:bg-zinc-800"
      >
        {isDark ? (
          <Moon size={20} color="#3b82f6" />
        ) : (
          <Sun size={20} color="#eab308" />
        )}
      </MotiView>
    </Pressable>
  );
}

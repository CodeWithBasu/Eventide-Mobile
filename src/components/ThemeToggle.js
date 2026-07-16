import React from 'react';
import { Pressable, View } from 'react-native';
import { MotiView } from 'moti';
import { Sun, Moon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable onPress={toggleColorScheme} className="ml-4">
      <View className={`w-16 h-8 rounded-full flex-row items-center px-1 border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-200 border-slate-300'}`}>
        <MotiView
          animate={{
            translateX: isDark ? 32 : 0,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className={`w-6 h-6 rounded-full items-center justify-center shadow-sm ${isDark ? 'bg-zinc-950' : 'bg-white'}`}
        >
          {isDark ? (
            <Moon size={14} color="#3b82f6" />
          ) : (
            <Sun size={14} color="#eab308" />
          )}
        </MotiView>
      </View>
    </Pressable>
  );
}

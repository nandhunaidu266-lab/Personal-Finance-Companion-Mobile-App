import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export const GoalScreen = ({
  currentTarget,
  savings,
  onSave
}: {
  currentTarget: number;
  savings: number;
  onSave: (target: number) => void;
}) => {
  const [target, setTarget] = useState(String(currentTarget));
  const percent = useMemo(() => {
    if (currentTarget <= 0) return 0;
    return Math.max(0, Math.min((savings / currentTarget) * 100, 100));
  }, [currentTarget, savings]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Savings Goal</Text>
      <Text style={styles.sub}>Set a monthly target and track progress.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Target</Text>
        <Text style={styles.value}>${currentTarget.toFixed(2)}</Text>

        <Text style={[styles.label, { marginTop: 10 }]}>Current Savings</Text>
        <Text style={styles.value}>${savings.toFixed(2)}</Text>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.progress}>{percent.toFixed(0)}% complete</Text>
      </View>

      <Text style={styles.label}>Update Monthly Target</Text>
      <TextInput
        value={target}
        onChangeText={setTarget}
        keyboardType="decimal-pad"
        style={styles.input}
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          const value = Number(target);
          if (value > 0) onSave(value);
        }}
      >
        <Text style={styles.buttonText}>Save Goal</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827'
  },
  sub: {
    color: '#6b7280',
    marginBottom: 8
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14
  },
  label: {
    color: '#374151',
    fontWeight: '600'
  },
  value: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700'
  },
  track: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 12
  },
  fill: {
    height: '100%',
    backgroundColor: '#16a34a'
  },
  progress: {
    marginTop: 6,
    color: '#374151'
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  }
});

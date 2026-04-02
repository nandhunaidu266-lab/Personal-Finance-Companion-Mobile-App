import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.wrap}>
    <Text style={styles.title}>Nothing here yet</Text>
    <Text style={styles.body}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#fafafa'
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827'
  },
  body: {
    color: '#6b7280'
  }
});

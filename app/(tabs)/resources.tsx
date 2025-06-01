import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ResourceCard } from '../../components/ResourceCard';
import { COLORS, SHADOWS, SIZES } from '../../constants/Colors';
import { resources } from '../../constants/mockData';

type ResourceCategory = 'all' | 'tips' | 'vocabulary' | 'math';

export default function ResourcesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('all');

  const filteredResources = resources.filter(resource => {
    if (activeCategory !== 'all' && resource.category !== activeCategory) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleResourcePress = (id: string) => {
    router.push(`/resource-detail?id=${id}`);
  };

  const renderCategoryPill = (category: string) => {
    const isActive = activeCategory === category;
    const label = category.charAt(0).toUpperCase() + category.slice(1);
    
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryPill,
          isActive && styles.activeCategoryPill,
        ]}
        onPress={() => setActiveCategory(category as ResourceCategory)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${label} category`}
        accessibilityState={{ selected: isActive }}
      >
        <Text
          style={[
            styles.categoryText,
            isActive && styles.activeCategoryText,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resources</Text>
        <Text style={styles.subtitle}>Study materials to help you succeed</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          accessibilityLabel="Search resources"
        />
        {searchQuery ? (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            accessibilityLabel="Clear search"
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={COLORS.textLight}
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {['all', 'tips', 'vocabulary', 'math'].map(renderCategoryPill)}
      </ScrollView>

      <ScrollView 
        style={styles.resourcesList} 
        contentContainerStyle={styles.resourcesListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredResources.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>
              {activeCategory === 'all' 
                ? 'All Resources' 
                : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Resources`}
            </Text>
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                title={resource.title}
                description={resource.description}
                image={resource.image}
                onPress={() => handleResourcePress(resource.id)}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={COLORS.textLight} style={{marginBottom: 12}} />
            <Text style={styles.emptyStateText}>No resources match your search.</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SIZES.padding,
    paddingHorizontal: 12,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.smallRadius,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    height: Platform.OS === 'ios' ? 40 : 48,
  },
  clearIcon: {
    padding: 4,
  },
  categoriesContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    flexGrow: 0,
  },
  categoriesContent: {
    paddingRight: SIZES.padding,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeCategoryPill: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFF',
    fontWeight: '600',
  },
  resourcesList: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  resourcesListContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  emptyState: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.smallRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

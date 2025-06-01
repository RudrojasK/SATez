import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Share, Animated } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Colors';
import { resources } from '@/constants/mockData';

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  // Find the resource by ID
  const resource = resources.find(item => item.id === id);
  
  // Get related resources (same category, excluding current resource)
  const relatedResources = resource 
    ? resources.filter(item => item.category === resource.category && item.id !== resource.id).slice(0, 2) 
    : [];
    
  // Animation and state variables
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const fabAnimation = useState(new Animated.Value(0))[0];
  
  // Handle bookmarking the resource
  const toggleBookmark = () => {
    setIsBookmarked(prev => !prev);
  };
  
  // Handle sharing the resource
  const shareResource = async () => {
    if (!resource) return;
    
    try {
      await Share.share({
        message: `Check out this SAT resource: ${resource.title} - ${resource.description}`,
        title: resource.title,
      });
    } catch (error) {
      console.error('Error sharing resource:', error);
    }
  };
    // Handle FAB animation
  useEffect(() => {
    Animated.timing(fabAnimation, {
      toValue: isFabOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFabOpen, fabAnimation]);
  
  const rotation = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });
  
  // Handle case when resource is not found
  if (!resource) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: 'Resource Details',
          headerBackTitle: 'Resources',
        }} />
        <View style={styles.errorContainer}>
          <Text>
            <Ionicons name="alert-circle-outline" size={64} color={COLORS.textLight} />
          </Text>
          <Text style={styles.errorText}>Resource not found</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: resource.title,
        headerBackTitle: 'Resources',
        headerRight: () => (
          <TouchableOpacity 
            onPress={toggleBookmark} 
            style={styles.headerButton}
          >            <Text>
              <Ionicons 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={COLORS.primary} 
              />
            </Text>
          </TouchableOpacity>
        ),
      }} />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image 
          source={resource.image}
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{resource.title}</Text>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
            </Text>
          </View>
          
          <Text style={styles.description}>{resource.description}</Text>
            {/* Display the resource's actual content from mock data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.paragraph}>
              {resource.content?.overview || "No overview available for this resource."}
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Points</Text>
            <View style={styles.bulletPoints}>
              {resource.content?.keyPoints ? (
                resource.content.keyPoints.map((point, index) => (
                  <View key={index} style={styles.bulletPoint}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.paragraph}>No key points available for this resource.</Text>
              )}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Explanation</Text>
            <Text style={styles.paragraph}>
              {resource.content?.details || "No detailed explanation available for this resource."}
            </Text>
          </View>          {/* Related Resources Section */}
          {relatedResources.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related Resources</Text>
              {relatedResources.map((relatedResource) => (
                <TouchableOpacity 
                  key={relatedResource.id}
                  style={styles.relatedResourceCard}
                  onPress={() => {
                    // Navigate to the related resource
                    router.replace(`/resource-detail?id=${relatedResource.id}`);
                  }}
                >
                  <View style={styles.relatedResourceContent}>
                    <Text style={styles.relatedResourceTitle} numberOfLines={2}>
                      {relatedResource.title}
                    </Text>
                    <Text style={styles.relatedResourceDescription} numberOfLines={1}>
                      {relatedResource.description}
                    </Text>
                  </View>
                  <Text>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* Back to Resources Button */}
          <TouchableOpacity 
            style={styles.backToResourcesButton}
            onPress={() => router.push('/resources')}
          >
            <Text style={styles.backButtonIcon}>
              <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
            </Text>
            <Text style={styles.backToResourcesText}>Back to all resources</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        {isFabOpen && (
          <View style={styles.fabActions}>
            <TouchableOpacity 
              style={[styles.fabAction, {backgroundColor: COLORS.primary}]}
              onPress={shareResource}
            >
              <Text>
                <Ionicons name="share-social-outline" size={22} color="#FFF" />
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.fabAction, {backgroundColor: isBookmarked ? COLORS.secondary : '#e91e63'}]}
              onPress={toggleBookmark}
            >
              <Text>
                <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={22} color="#FFF" />
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setIsFabOpen(current => !current)}
        >
          <Animated.View style={{transform: [{rotate: rotation}] }}>
            <Text>
              <Ionicons name="add" size={24} color="#FFF" />
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.card,
  },
  content: {
    padding: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary + '20', // 20% opacity
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  bulletPoints: {
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 10,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },  relatedResourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  relatedResourceContent: {
    flex: 1,
    paddingRight: 12,
  },
  relatedResourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },  relatedResourceDescription: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  headerButton: {
    padding: 8,
    marginRight: 4,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  fabActions: {
    position: 'absolute',
    bottom: 70,
    right: 8,
    flexDirection: 'column',
    zIndex: 1,
  },
  fabAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backToResourcesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 10,
  },
  backButtonIcon: {
    marginRight: 6,
  },
  backToResourcesText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 16,
  },
});

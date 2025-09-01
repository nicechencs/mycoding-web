'use client'

import { useState, useMemo, useCallback } from 'react'
import { Tag, ModuleType } from '../types'
import { taxonomyManager } from '../manager'

/**
 * Hook for managing tags in React components
 */
export function useTags(module: ModuleType) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const allTags = useMemo(() => {
    return taxonomyManager.getTags(module)
  }, [module])

  const popularTags = useMemo(() => {
    return taxonomyManager.getPopularTags(module, 10)
  }, [module])

  const trendingTags = useMemo(() => {
    return taxonomyManager.getTrendingTags(module, 5)
  }, [module])

  const filteredTags = useMemo(() => {
    if (!searchQuery) return allTags
    return taxonomyManager.searchTags(module, searchQuery)
  }, [module, searchQuery, allTags])

  const maxTags = useMemo(() => {
    return taxonomyManager.getMaxTags(module)
  }, [module])

  const allowsCustom = useMemo(() => {
    return taxonomyManager.allowsCustomTags(module)
  }, [module])

  const addTag = useCallback((tagName: string) => {
    if (selectedTags.length >= maxTags) {
      console.warn(`Maximum ${maxTags} tags allowed`)
      return false
    }
    
    if (selectedTags.includes(tagName)) {
      console.warn(`Tag "${tagName}" already selected`)
      return false
    }

    if (!allowsCustom) {
      const validTags = allTags.map(t => t.name)
      if (!validTags.includes(tagName)) {
        console.warn(`Custom tags not allowed. "${tagName}" is not valid`)
        return false
      }
    }

    setSelectedTags(prev => [...prev, tagName])
    return true
  }, [selectedTags, maxTags, allowsCustom, allTags])

  const removeTag = useCallback((tagName: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagName))
  }, [])

  const toggleTag = useCallback((tagName: string) => {
    if (selectedTags.includes(tagName)) {
      removeTag(tagName)
    } else {
      addTag(tagName)
    }
  }, [selectedTags, addTag, removeTag])

  const clearTags = useCallback(() => {
    setSelectedTags([])
  }, [])

  const validateTags = useCallback((tags: string[]): boolean => {
    return taxonomyManager.validateTags(module, tags)
  }, [module])

  const getTagByName = useCallback((tagName: string): Tag | undefined => {
    return allTags.find(tag => tag.name === tagName)
  }, [allTags])

  return {
    // State
    selectedTags,
    searchQuery,
    
    // Setters
    setSelectedTags,
    setSearchQuery,
    
    // Data
    allTags,
    popularTags,
    trendingTags,
    filteredTags,
    
    // Config
    maxTags,
    allowsCustom,
    
    // Actions
    addTag,
    removeTag,
    toggleTag,
    clearTags,
    validateTags,
    getTagByName
  }
}
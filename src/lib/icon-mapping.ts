// Lucide React icon mapping for notes
export const ICON_MAPPING: Record<string, string> = {
  // Work & Business
  'work': 'Briefcase',
  'business': 'Building2',
  'meeting': 'Users',
  'project': 'FolderOpen',
  'task': 'CheckSquare',
  'deadline': 'Calendar',
  'presentation': 'Presentation',
  'report': 'FileText',
  'budget': 'DollarSign',
  'finance': 'TrendingUp',
  
  // Ideas & Creativity
  'idea': 'Lightbulb',
  'creative': 'Palette',
  'design': 'PenTool',
  'art': 'Image',
  'music': 'Music',
  'writing': 'Pen',
  'story': 'BookOpen',
  'poetry': 'Feather',
  
  // Technology
  'tech': 'Cpu',
  'code': 'Code',
  'app': 'Smartphone',
  'website': 'Globe',
  'database': 'Database',
  'security': 'Shield',
  'ai': 'Brain',
  'data': 'BarChart3',
  
  // Personal & Life
  'personal': 'User',
  'family': 'Users',
  'health': 'Heart',
  'fitness': 'Activity',
  'travel': 'Plane',
  'vacation': 'MapPin',
  'home': 'Home',
  'food': 'Utensils',
  'recipe': 'ChefHat',
  'shopping': 'ShoppingCart',
  
  // Learning & Education
  'study': 'Book',
  'research': 'Search',
  'course': 'GraduationCap',
  'language': 'Languages',
  'math': 'Calculator',
  'science': 'Microscope',
  'history': 'Clock',
  'philosophy': 'Brain',
  
  // Goals & Planning
  'goal': 'Target',
  'plan': 'Map',
  'strategy': 'Chess',
  'vision': 'Eye',
  'dream': 'Star',
  'future': 'Rocket',
  'success': 'Trophy',
  'achievement': 'Award',
  
  // Problems & Solutions
  'problem': 'AlertTriangle',
  'solution': 'CheckCircle',
  'bug': 'Bug',
  'fix': 'Wrench',
  'improvement': 'TrendingUp',
  'optimization': 'Zap',
  
  // Communication
  'email': 'Mail',
  'phone': 'Phone',
  'message': 'MessageSquare',
  'chat': 'MessageCircle',
  'social': 'Share2',
  'network': 'Network',
  
  // Default
  'default': 'FileText'
}

export function getIconForContent(content: string): string {
  const lowerContent = content.toLowerCase()
  
  // Check for specific keywords
  for (const [keyword, icon] of Object.entries(ICON_MAPPING)) {
    if (lowerContent.includes(keyword)) {
      return icon
    }
  }
  
  // Check for common patterns
  if (lowerContent.includes('todo') || lowerContent.includes('task')) return 'CheckSquare'
  if (lowerContent.includes('meeting') || lowerContent.includes('call')) return 'Users'
  if (lowerContent.includes('idea') || lowerContent.includes('thought')) return 'Lightbulb'
  if (lowerContent.includes('recipe') || lowerContent.includes('cook')) return 'ChefHat'
  if (lowerContent.includes('travel') || lowerContent.includes('trip')) return 'Plane'
  if (lowerContent.includes('work') || lowerContent.includes('job')) return 'Briefcase'
  if (lowerContent.includes('study') || lowerContent.includes('learn')) return 'Book'
  if (lowerContent.includes('goal') || lowerContent.includes('target')) return 'Target'
  if (lowerContent.includes('problem') || lowerContent.includes('issue')) return 'AlertTriangle'
  if (lowerContent.includes('code') || lowerContent.includes('programming')) return 'Code'
  
  return 'FileText' // Default icon
}

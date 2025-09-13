import { 
  Briefcase, Building2, Users, FolderOpen, CheckSquare, Calendar, 
  Presentation, FileText, DollarSign, TrendingUp, Lightbulb, Palette, 
  PenTool, Image, Music, Pen, BookOpen, Feather, Cpu, Code, Smartphone, 
  Globe, Database, Shield, Brain, BarChart3, User, Heart, Activity, 
  Plane, MapPin, Home, Utensils, ChefHat, ShoppingCart, Book, Search, 
  GraduationCap, Languages, Calculator, Microscope, Clock, Target, Map, 
  Chess, Eye, Star, Rocket, Trophy, Award, AlertTriangle, CheckCircle, 
  Bug, Wrench, Zap, Mail, Phone, MessageSquare, MessageCircle, Share2, 
  Network
} from "lucide-react"

const iconMap: Record<string, any> = {
  Briefcase,
  Building2,
  Users,
  FolderOpen,
  CheckSquare,
  Calendar,
  Presentation,
  FileText,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Palette,
  PenTool,
  Image,
  Music,
  Pen,
  BookOpen,
  Feather,
  Cpu,
  Code,
  Smartphone,
  Globe,
  Database,
  Shield,
  Brain,
  BarChart3,
  User,
  Heart,
  Activity,
  Plane,
  MapPin,
  Home,
  Utensils,
  ChefHat,
  ShoppingCart,
  Book,
  Search,
  GraduationCap,
  Languages,
  Calculator,
  Microscope,
  Clock,
  Target,
  Map,
  Chess,
  Eye,
  Star,
  Rocket,
  Trophy,
  Award,
  AlertTriangle,
  CheckCircle,
  Bug,
  Wrench,
  Zap,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Share2,
  Network
}

interface DynamicIconProps {
  name: string
  size?: number
  className?: string
}

export function DynamicIcon({ name, size = 20, className = "" }: DynamicIconProps) {
  const IconComponent = iconMap[name] || FileText
  
  return <IconComponent size={size} className={className} />
}

import type { StyleProp, TextStyle } from 'react-native'
import { getIconComponent, IconColors, type IconFamilies, Icons } from '../constants/icons'
import { useTheme } from '../contexts/theme-context'

interface IconProps {
  name: keyof typeof Icons
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
  family?: keyof typeof IconFamilies
}

export default function Icon({ name, size, color, style, family }: IconProps) {
  const { isDark } = useTheme()
  const icon = Icons[name]
  const IconComponent = getIconComponent(family || (icon.family as keyof typeof IconFamilies))

  // Default color based on theme if not provided
  const defaultColor = isDark ? IconColors.white : IconColors.black
  const iconColor = color || defaultColor

  return (
    <IconComponent
      name={icon.name as never}
      size={size || icon.size}
      color={iconColor}
      style={style}
    />
  )
}

// Predefined themed icons for common use cases
export const ThemedIcon = {
  // Navigation icons with theme-aware colors
  Home: (props: Omit<IconProps, 'name'>) => (
    <Icon name="home" color={IconColors.primary} {...props} />
  ),
  Bible: (props: Omit<IconProps, 'name'>) => (
    <Icon name="bible" color={IconColors.primary} {...props} />
  ),
  Progress: (props: Omit<IconProps, 'name'>) => (
    <Icon name="progress" color={IconColors.accent} {...props} />
  ),
  Profile: (props: Omit<IconProps, 'name'>) => (
    <Icon name="profile" color={IconColors.neutral} {...props} />
  ),

  // Action icons
  Search: (props: Omit<IconProps, 'name'>) => (
    <Icon name="search" color={IconColors.info} {...props} />
  ),
  Favorite: (props: Omit<IconProps, 'name'>) => (
    <Icon name="favorite" color={IconColors.error} {...props} />
  ),
  Share: (props: Omit<IconProps, 'name'>) => (
    <Icon name="share" color={IconColors.info} {...props} />
  ),

  // Status icons
  Success: (props: Omit<IconProps, 'name'>) => (
    <Icon name="success" color={IconColors.success} {...props} />
  ),
  Error: (props: Omit<IconProps, 'name'>) => (
    <Icon name="error" color={IconColors.error} {...props} />
  ),
  Warning: (props: Omit<IconProps, 'name'>) => (
    <Icon name="warning" color={IconColors.warning} {...props} />
  ),
}

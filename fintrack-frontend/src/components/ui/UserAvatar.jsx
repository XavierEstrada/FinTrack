import { getAvatarGradient } from '../../lib/utils'

/**
 * Muestra la foto de perfil si existe, o el gradiente con iniciales si no.
 * Prop `className` controla tamaño (ej. "w-8 h-8").
 */
export default function UserAvatar({ profile, session, className = 'w-8 h-8', textClassName = 'text-xs' }) {
  const displayName = profile?.full_name
    ?? session?.user?.user_metadata?.full_name
    ?? session?.user?.email
    ?? '?'

  const initials = displayName
    .split(/[\s@]/).filter(Boolean)
    .map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const gradient   = getAvatarGradient(displayName)
  const avatarUrl  = profile?.avatar_url

  return (
    <div
      className={`${className} rounded-full overflow-hidden shrink-0 flex items-center justify-center`}
      style={!avatarUrl ? { background: gradient } : undefined}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={`text-white font-bold ${textClassName}`}>{initials}</span>
      )}
    </div>
  )
}

interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-pale-pistachio">
      <div>
        <h1 className="font-display text-3xl text-burgundy">{title}</h1>
        {subtitle && (
          <p className="text-sm text-dusk mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  )
}

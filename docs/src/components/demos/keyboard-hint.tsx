'use client'

type KeyboardHintProps = {
  orientation: 'horizontal' | 'vertical'
}

export function KeyboardHint({ orientation }: KeyboardHintProps) {
  const keys =
    orientation === 'horizontal'
      ? [
          { key: '← →', description: 'Navigate between items' },
          { key: 'Home', description: 'Go to first item' },
          { key: 'End', description: 'Go to last item' },
        ]
      : [
          { key: '↑ ↓', description: 'Navigate between items' },
          { key: 'Home', description: 'Go to first item' },
          { key: 'End', description: 'Go to last item' },
        ]

  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <h3 className="mb-3 text-sm font-medium">Keyboard Navigation</h3>
      <ul className="space-y-2 text-sm">
        {keys.map(({ key, description }) => (
          <li key={key} className="flex items-center gap-3">
            <kbd className="inline-flex min-w-[3rem] items-center justify-center rounded border bg-background px-2 py-1 font-mono text-xs">
              {key}
            </kbd>
            <span className="text-muted-foreground">{description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

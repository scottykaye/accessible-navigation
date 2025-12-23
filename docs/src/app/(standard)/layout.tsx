import React from 'react'
import Link from 'next/link'
import Wrapper from '@/components/ui/wrapper'

export default async function StandardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="border-b">
        <Wrapper>
          <nav className="flex items-center justify-between py-4">
            <Link href="/" className="text-lg font-bold">
              keyboard-navigation
            </Link>
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/demos"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Demos
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/scottykaye/accessible-navigation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </Wrapper>
      </header>
      <main className="min-h-[calc(100vh-8rem)]">
        <Wrapper>{children}</Wrapper>
      </main>
      <footer className="border-t">
        <Wrapper>
          <div className="py-6 text-center text-sm text-muted-foreground">
            Built with keyboard-navigation v0.1.0
          </div>
        </Wrapper>
      </footer>
    </>
  )
}

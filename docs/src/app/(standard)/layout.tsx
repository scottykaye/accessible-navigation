import React from 'react'
import Wrapper from '@/components/ui/wrapper'

export default async function StandardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header>
        <Wrapper>Header</Wrapper>
      </header>
      <main>
        <Wrapper>{children}</Wrapper>
      </main>
      <footer>
        <Wrapper>Footer</Wrapper>
      </footer>
    </>
  )
}

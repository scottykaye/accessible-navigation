import { ReactNode } from 'react'

export default function Wrapper({ children }: { children: ReactNode }) {
  return <section className="p-6 max-w-7xl mx-auto Wrapper">{children}</section>
}

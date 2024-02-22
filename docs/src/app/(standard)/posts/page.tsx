import React, { Suspense } from 'react'

export default async function StandardPage() {
  return <Suspense fallback={'Loading...'}>Posts</Suspense>
}

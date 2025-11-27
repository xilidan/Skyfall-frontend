'use client'

import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function DocsPage() {
  return (
    <div className="h-screen w-full bg-transparent">
      <SwaggerUI url="/openapi.json" />
    </div>
  )
}

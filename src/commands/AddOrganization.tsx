'use client'

import {OrganizationSettings} from '@/components/settings/OrganizationSettings'

export function AddOrganization() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="p-6 md:p-8">
          <OrganizationSettings />
        </div>
      </div>
    </div>
  )
}

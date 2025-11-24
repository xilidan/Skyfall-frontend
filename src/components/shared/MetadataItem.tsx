export function MetadataItem({label, children}: {label: React.ReactNode; children: React.ReactNode}) {
  return (
    <div className="flex items-baseline gap-4 py-1">
      <span className="min-w-0 text-sm font-medium">{label}</span>

      <span className="flex-1 border-b border-dashed border-neutral-500/60" />

      <span className="flex-[0_0_12rem] text-sm lg:flex-[0_0_36rem]">{children}</span>
    </div>
  )
}

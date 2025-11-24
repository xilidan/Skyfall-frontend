export type IndexCommandScope = {type: 'global'} | {type: 'deleteProperty'; propertyId: number}

export default function IndexCommand({scope}: {scope: IndexCommandScope}) {
  return <div>{scope.type}</div>
}

'use client'
import {DialogTrigger} from 'react-aria-components'
import {Omnibar} from './Omnibar'

export function OmnibarWithTrigger() {
  return (
    <DialogTrigger>
      <Omnibar />
    </DialogTrigger>
  )
}

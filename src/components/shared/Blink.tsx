'use client'
import {useEffect, useState} from 'react'

type iBlink = {
  positionLeft?: string
  positionTop?: string
}

export function Blink({positionLeft = 'left-0', positionTop = 'top-0'}: iBlink) {
  const [timeStart, setTimeStart] = useState(0)

  useEffect(() => {
    setTimeStart(Math.random() * 4000 + 1000)
  }, [])

  return (
    <div
      style={{animationDelay: `${timeStart}ms`}}
      className={`lg:w-[40px] lg:h-[40px] w-[32px] h-[32px] absolute opacity-0 ${positionLeft} ${positionTop} bg-[#fff] animate-[pulse_4s_infinite] rounded-[10px]`}
    />
  )
}

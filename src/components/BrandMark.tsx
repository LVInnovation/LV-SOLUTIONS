import { useState } from 'react'
import { BRAND_NAME } from '../data/contact'

type BrandMarkProps = {
  compact?: boolean
  variant?: 'default' | 'header'
  showName?: boolean
  className?: string
}

export default function BrandMark({
  compact = false,
  variant = 'default',
  showName = true,
  className = '',
}: BrandMarkProps) {
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const isHeader = variant === 'header'
  const sizeClass = compact
    ? 'h-10 w-10'
    : isHeader
      ? ''
      : 'h-12 w-12'
  const frameClass =
    'rounded-full border-cyan-300/45 bg-slate-950 shadow-lg shadow-cyan-500/25'
  const headerFrameClass =
    'relative flex shrink-0 transform-gpu items-center justify-center rounded-xl border border-cyan-300/15 bg-slate-950/20 p-1 shadow-[0_0_20px_rgba(34,211,238,0.24),0_0_36px_rgba(168,85,247,0.18)] transition duration-300 ease-out group-hover:scale-105 group-hover:border-cyan-200/35 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.36),0_0_50px_rgba(168,85,247,0.28)]'
  const imageClass = isHeader
    ? 'h-auto max-h-14 w-auto max-w-[88px] object-contain sm:max-h-16 sm:max-w-[100px] lg:max-h-20 lg:max-w-[110px]'
    : 'h-full w-full object-cover'
  const nameClass = isHeader
    ? 'text-base font-black text-white sm:text-lg md:text-xl'
    : 'text-sm font-bold text-white sm:text-base'
  const subtitleClass = isHeader
    ? 'mt-1 text-xs font-medium text-cyan-100/75 sm:text-sm'
    : 'text-xs text-cyan-200/70'

  return (
    <div
      className={`group flex items-center ${
        isHeader ? 'gap-4 md:gap-5' : 'gap-3'
      } ${className}`}
    >
      <div
        className={
          isHeader
            ? headerFrameClass
            : `${sizeClass} ${frameClass} relative grid shrink-0 transform-gpu place-items-center overflow-hidden border`
        }
        aria-hidden="true"
      >
        {!logoFailed && (
          <img
            src="/logo.png"
            alt=""
            className={`${imageClass} transition duration-300 ${
              logoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLogoLoaded(true)}
            onError={() => setLogoFailed(true)}
          />
        )}
        {(!logoLoaded || logoFailed) && (
          <span
            className={
              isHeader
                ? 'grid h-12 w-12 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(80,221,255,0.45),transparent_35%),linear-gradient(135deg,rgba(14,24,50,0.96),rgba(63,13,91,0.92))] text-base font-black text-white shadow-[0_0_24px_rgba(34,211,238,0.3)] sm:h-14 sm:w-14 lg:h-16 lg:w-16'
                : 'absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(80,221,255,0.45),transparent_35%),linear-gradient(135deg,rgba(14,24,50,0.96),rgba(63,13,91,0.92))] text-sm font-black text-white'
            }
          >
            L&V
          </span>
        )}
      </div>
      {showName && (
        <div className="leading-tight">
          <p className={nameClass}>{BRAND_NAME}</p>
          <p className={subtitleClass}>Sistemas sob medida</p>
        </div>
      )}
    </div>
  )
}

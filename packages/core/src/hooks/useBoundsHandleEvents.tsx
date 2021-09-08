import * as React from 'react'
import type { TLBoundsEdge, TLBoundsCorner } from '+types'
import { useTLContext } from './useTLContext'

export function useBoundsHandleEvents(id: TLBoundsCorner | TLBoundsEdge | 'rotate') {
  const { callbacks, inputs } = useTLContext()

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      e.stopPropagation()
      e.currentTarget?.setPointerCapture(e.pointerId)
      const info = inputs.pointerDown(e, id)

      callbacks.onPointBoundsHandle?.(info, e)
      callbacks.onPointerDown?.(info, e)
    },
    [inputs, callbacks, id]
  )

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      e.stopPropagation()
      const isDoubleClick = inputs.isDoubleClick()
      const info = inputs.pointerUp(e, id)

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget?.releasePointerCapture(e.pointerId)
      }

      if (isDoubleClick && !(info.altKey || info.metaKey)) {
        callbacks.onDoubleClickBoundsHandle?.(info, e)
      }

      callbacks.onReleaseBoundsHandle?.(info, e)
      callbacks.onPointerUp?.(info, e)
    },
    [inputs, callbacks, id]
  )

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        callbacks.onDragBoundsHandle?.(inputs.pointerMove(e, id), e)
      }
      const info = inputs.pointerMove(e, id)
      callbacks.onPointerMove?.(info, e)
    },
    [inputs, callbacks, id]
  )

  const onPointerEnter = React.useCallback(
    (e: React.PointerEvent) => {
      callbacks.onHoverBoundsHandle?.(inputs.pointerEnter(e, id), e)
    },
    [inputs, callbacks, id]
  )

  const onPointerLeave = React.useCallback(
    (e: React.PointerEvent) => {
      callbacks.onUnhoverBoundsHandle?.(inputs.pointerEnter(e, id), e)
    },
    [inputs, callbacks, id]
  )

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    e.preventDefault()
  }, [])

  const onTouchEnd = React.useCallback((e: React.TouchEvent) => {
    e.preventDefault()
  }, [])

  return {
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    onTouchStart,
    onTouchEnd,
  }
}

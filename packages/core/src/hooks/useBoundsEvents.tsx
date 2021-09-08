import * as React from 'react'
import { useTLContext } from './useTLContext'

export function useBoundsEvents() {
  const { callbacks, inputs } = useTLContext()

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      e.stopPropagation()
      e.currentTarget?.setPointerCapture(e.pointerId)
      const info = inputs.pointerDown(e, 'bounds')

      callbacks.onPointBounds?.(info, e)
      callbacks.onPointerDown?.(info, e)
    },
    [callbacks, inputs]
  )

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      e.stopPropagation()
      const isDoubleClick = inputs.isDoubleClick()
      const info = inputs.pointerUp(e, 'bounds')

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget?.releasePointerCapture(e.pointerId)
      }

      if (isDoubleClick && !(info.altKey || info.metaKey)) {
        callbacks.onDoubleClickBounds?.(info, e)
      }

      callbacks.onReleaseBounds?.(info, e)
      callbacks.onPointerUp?.(info, e)
    },
    [callbacks, inputs]
  )

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (inputs.pointer && e.pointerId !== inputs.pointer.pointerId) return

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        callbacks.onDragBounds?.(inputs.pointerMove(e, 'bounds'), e)
      }
      const info = inputs.pointerMove(e, 'bounds')
      callbacks.onPointerMove?.(info, e)
    },
    [callbacks, inputs]
  )

  const onPointerEnter = React.useCallback(
    (e: React.PointerEvent) => {
      callbacks.onHoverBounds?.(inputs.pointerEnter(e, 'bounds'), e)
    },
    [callbacks, inputs]
  )

  const onPointerLeave = React.useCallback(
    (e: React.PointerEvent) => {
      callbacks.onUnhoverBounds?.(inputs.pointerEnter(e, 'bounds'), e)
    },
    [callbacks, inputs]
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

import { ref, computed, watchEffect } from 'vue'
import { isNumber } from '@element-plus/utils-new'
import type { SpaceProps } from './space'

import type { CSSProperties, StyleValue } from 'vue'
import type { ComponentSize } from '@element-plus/constants'

const SIZE_MAP: Record<ComponentSize, number> = {
  small: 8,
  default: 12,
  large: 16,
}

export function useSpace(props: SpaceProps) {
  const classes = computed(() => [
    'el-space',
    `el-space--${props.direction}`,
    props.class,
  ])

  const horizontalSize = ref(0)
  const verticalSize = ref(0)

  const containerStyle = computed<StyleValue>(() => {
    const wrapKls: CSSProperties =
      props.wrap || props.fill
        ? { flexWrap: 'wrap', marginBottom: `-${verticalSize.value}px` }
        : {}
    const alignment: CSSProperties = {
      alignItems: props.alignment,
    }
    return [wrapKls, alignment, props.style]
  })

  const itemStyle = computed<StyleValue>(() => {
    const itemBaseStyle: CSSProperties = {
      paddingBottom: `${verticalSize.value}px`,
      marginRight: `${horizontalSize.value}px`,
    }

    const fillStyle: CSSProperties = props.fill
      ? { flexGrow: 1, minWidth: `${props.fillRatio}%` }
      : {}

    return [itemBaseStyle, fillStyle]
  })

  watchEffect(() => {
    const { size = 'small', wrap, direction: dir, fill } = props

    // when the specified size have been given
    if (Array.isArray(size)) {
      const [h = 0, v = 0] = size
      horizontalSize.value = h
      verticalSize.value = v
    } else {
      let val: number
      if (isNumber(size)) {
        val = size
      } else {
        val = SIZE_MAP[size] || SIZE_MAP.small
      }

      if ((wrap || fill) && dir === 'horizontal') {
        horizontalSize.value = verticalSize.value = val
      } else {
        if (dir === 'horizontal') {
          horizontalSize.value = val
          verticalSize.value = 0
        } else {
          verticalSize.value = val
          horizontalSize.value = 0
        }
      }
    }
  })

  return {
    classes,
    containerStyle,
    itemStyle,
  }
}

// Libraries
import React, {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  UIEvent,
} from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import Scrollbar from 'react-scrollbars-custom'
import {ScrollState} from 'react-scrollbars-custom/dist/types/types'

// Styles
import './DapperScrollbars.scss'

// Types
import {StandardFunctionProps, InfluxColors} from '../../Types'

// react-scrollbars-custom uses a highly unusual type
// to presumably handle touch and mouse events simultaneously
export type FusionScrollEvent = UIEvent<HTMLDivElement> & ScrollState
// Using this custom type makes typescript happy
// and exposes enough typing to properly interface
// with the onScroll and onUpdate props
export type FusionScrollHandler = (
  scrollValues: FusionScrollEvent,
  prevScrollValues?: ScrollState
) => void

interface DapperScrollbarsProps extends StandardFunctionProps {
  /** Toggle display of tracks when no scrolling is necessary */
  removeTracksWhenNotUsed?: boolean
  /** Toggle display of vertical track when no scrolling is necessary */
  removeTrackYWhenNotUsed?: boolean
  /** Toggle display of horizontal track when no scrolling is necessary */
  removeTrackXWhenNotUsed?: boolean
  /** Disable scrolling horizontally */
  noScrollX?: boolean
  /** Disable scrolling vertically */
  noScrollY?: boolean
  /** Disable scrolling */
  noScroll?: boolean
  /** Gradient start color */
  thumbStartColor?: string | InfluxColors
  /** Gradient end color */
  thumbStopColor?: string | InfluxColors
  /** Hide scrollbar when not actively scrolling */
  autoHide?: boolean
  /** Scroll container will grow to fit the content width and height */
  autoSize?: boolean
  /** Scroll container will grow to fit the content width */
  autoSizeWidth?: boolean
  /** Scroll container will grow to fit the content height */
  autoSizeHeight?: boolean
  /** Vertical scroll position in pixels */
  scrollTop?: number
  /** Horizontal scroll position in pixels */
  scrollLeft?: number
  /** Function to be called when called scroll event fires */
  onScroll?: FusionScrollHandler
  /** Function called after component updated */
  onUpdate?: FusionScrollHandler
}

export const DapperScrollbars: FunctionComponent<DapperScrollbarsProps> = ({
  id,
  style,
  children,
  className,
  onScroll,
  onUpdate,
  scrollTop = 0,
  scrollLeft = 0,
  autoHide = false,
  autoSize = false,
  noScroll = false,
  noScrollX = false,
  noScrollY = false,
  autoSizeWidth = false,
  autoSizeHeight = false,
  thumbStopColor = 'rgba(255, 255, 255, 0.25)',
  thumbStartColor = 'rgba(255, 255, 255, 0.25)',
  testID = 'dapper-scrollbars',
  removeTracksWhenNotUsed = true,
  removeTrackYWhenNotUsed = true,
  removeTrackXWhenNotUsed = true,
}) => {
  const scrollEl = useRef<any>(null)
  // State is used here to ensure that the scroll position does not jump when
  // a component using DapperScrollbars re-renders
  const [scrollTopPos, setScrollTopPos] = useState<number>(Number(scrollTop))
  const [scrollLeftPos, setScrollLeftPos] = useState<number>(Number(scrollLeft))

  useEffect(() => {
    setScrollTopPos(Number(scrollTop))
    setScrollLeftPos(Number(scrollLeft))
  }, [scrollTop, scrollLeft])

  const dapperScrollbarsClass = classnames('cf-dapper-scrollbars', {
    'cf-dapper-scrollbars--autohide': autoHide,
    [`${className}`]: className,
  })

  const thumbXStyle = {
    background: `linear-gradient(to right,  ${thumbStartColor} 0%,${thumbStopColor} 100%)`,
  }

  const thumbYStyle = {
    background: `linear-gradient(to bottom,  ${thumbStartColor} 0%,${thumbStopColor} 100%)`,
  }

  const handleOnScroll: FusionScrollHandler = (
    scrollValues,
    prevScrollValues
  ) => {
    if (onScroll) {
      onScroll(scrollValues, prevScrollValues)
    }

    const {scrollTop, scrollLeft} = scrollValues
    setScrollTopPos(scrollTop)
    setScrollLeftPos(scrollLeft)
  }

  const handleUpdate: FusionScrollHandler = (
    scrollValues,
    prevScrollValues
  ) => {
    if (onUpdate) {
      onUpdate(scrollValues, prevScrollValues)
    }
  }

  return (
    <Scrollbar
      ref={scrollEl}
      onScroll={handleOnScroll}
      onUpdate={handleUpdate}
      data-testid={testID}
      translateContentSizesToHolder={autoSize}
      translateContentSizeYToHolder={autoSizeHeight}
      translateContentSizeXToHolder={autoSizeWidth}
      className={dapperScrollbarsClass}
      style={style}
      noDefaultStyles={false}
      removeTracksWhenNotUsed={removeTracksWhenNotUsed}
      removeTrackYWhenNotUsed={removeTrackYWhenNotUsed}
      removeTrackXWhenNotUsed={removeTrackXWhenNotUsed}
      noScrollX={noScrollX}
      noScrollY={noScrollY}
      noScroll={noScroll}
      wrapperProps={{className: 'cf-dapper-scrollbars--wrapper'}}
      contentProps={{className: 'cf-dapper-scrollbars--content'}}
      trackXProps={{className: 'cf-dapper-scrollbars--track-x'}}
      thumbXProps={{
        renderer: props => {
          const {elementRef, style, ...restProps} = props
          const thumbStyle = {...style, ...thumbXStyle}
          return (
            <div
              className="cf-dapper-scrollbars--thumb-x"
              ref={elementRef}
              style={thumbStyle}
              {...restProps}
              data-testid={`${testID}--thumb-x`}
            />
          )
        },
      }}
      trackYProps={{className: 'cf-dapper-scrollbars--track-y'}}
      thumbYProps={{
        renderer: props => {
          const {elementRef, style, ...restProps} = props
          const thumbStyle = {...style, ...thumbYStyle}
          return (
            <div
              className="cf-dapper-scrollbars--thumb-y"
              ref={elementRef}
              style={thumbStyle}
              {...restProps}
              data-testid={`${testID}--thumb-y`}
            />
          )
        },
      }}
      scrollTop={scrollTopPos}
      scrollLeft={scrollLeftPos}
      id={id}
      download={null}
      inlist={null}
    >
      {children}
    </Scrollbar>
  )
}

DapperScrollbars.displayName = 'DapperScrollbars'

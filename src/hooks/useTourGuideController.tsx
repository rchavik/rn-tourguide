import * as React from 'react'
import { TourGuideContext } from '../components/TourGuideContext'
import { TourGuideZone, TourGuideZoneProps } from '../components/TourGuideZone'
import {
  TourGuideZoneByPosition,
  TourGuideZoneByPositionProps,
} from '../components/TourGuideZoneByPosition'

export const useTourGuideController = (tourKey?: string) => {
  const { start, canStart, stop, eventEmitter, getCurrentStep, setTourKey } =
    React.useContext(TourGuideContext)

  let key = tourKey ?? '_default'

  const _start = (fromStep?: number) => {
    setTourKey && setTourKey(key)
    if (start) {
      start(key, fromStep)
    }
  }
  const _stop = () => {
    if (stop) {
      stop(key)
    }
  }
  const _eventEmitter = eventEmitter ? eventEmitter[key] : undefined
  const _canStart = canStart ? canStart[key] : undefined
  const _getCurrentStep = () => {
    if (getCurrentStep) {
      return getCurrentStep(key)
    }
    return undefined
  }

  React.useEffect(() => {
    setTourKey && setTourKey(key)
  }, [])

  const KeyedTourGuideZone: React.FC<Omit<TourGuideZoneProps, 'tourKey'>> =
    React.useCallback(
      ({ children, ...rest }) => {
        return (
          <TourGuideZone {...rest} tourKey={key}>
            {children}
          </TourGuideZone>
        )
      },
      [key],
    )
  const KeyedTourGuideZoneByPosition: React.FC<
    Omit<TourGuideZoneByPositionProps, 'tourKey'>
  > = React.useCallback(
    (props) => {
      return <TourGuideZoneByPosition {...props} tourKey={key} />
    },
    [key],
  )

  return {
    start: _start,
    stop: _stop,
    eventEmitter: _eventEmitter,
    getCurrentStep: _getCurrentStep,
    canStart: _canStart,
    tourKey: key,
    TourGuideZone: KeyedTourGuideZone,
    TourGuideZoneByPosition: KeyedTourGuideZoneByPosition,
  }
}

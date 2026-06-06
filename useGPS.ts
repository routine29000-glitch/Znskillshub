import { useState, useCallback } from 'react'

export interface GPSPosition {
  lat: number
  lng: number
  accuracy: number
}

type GPSStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied'

export function useGPS() {
  const [position, setPosition] = useState<GPSPosition | null>(null)
  const [status, setStatus] = useState<GPSStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const locate = useCallback((): Promise<GPSPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setStatus('error')
        setError('المتصفح لا يدعم تحديد الموقع')
        reject(new Error('Geolocation not supported'))
        return
      }

      setStatus('loading')
      setError(null)

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const gps: GPSPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }
          setPosition(gps)
          setStatus('success')
          resolve(gps)
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setStatus('denied')
            setError('تم رفض إذن الموقع الجغرافي. يرجى تفعيله من إعدادات المتصفح.')
          } else {
            setStatus('error')
            setError('تعذّر تحديد موقعك. حاول مرة أخرى.')
          }
          reject(err)
        },
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 60_000,
        }
      )
    })
  }, [])

  const reset = useCallback(() => {
    setPosition(null)
    setStatus('idle')
    setError(null)
  }, [])

  return {
    position,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isDenied: status === 'denied',
    locate,
    reset,
  }
}

// Haversine distance between two GPS points (km)
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1))
}

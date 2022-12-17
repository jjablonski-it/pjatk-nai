import { useCallback } from 'react'

type Props = {}

export const VideoBox = (props: Props) => {
  const handleVideoRef = useCallback(async (videoRef: HTMLVideoElement) => {
    console.log('handleVideoRef', videoRef)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    })
    if (videoRef) {
      videoRef.srcObject = stream
    }
  }, [])

  return <video ref={handleVideoRef} autoPlay />
}

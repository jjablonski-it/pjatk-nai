import { HandPose, load as loadHandpose } from '@tensorflow-models/handpose'
import '@tensorflow/tfjs'
import { useCallback } from 'react'

const HEIGHT = 500
const WIDTH = 500

export const VideoBox = () => {
  const handleVideoRef = useCallback(async (videoRef: HTMLVideoElement) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    })
    videoRef.srcObject = stream
    runHandpose(videoRef)
  }, [])

  const runHandpose = async (videoRef: HTMLVideoElement) => {
    const handpose = await loadHandpose()
    console.log('Handpose model loaded')
    setInterval(() => {
      checkForHand(handpose, videoRef)
    }, 100)
  }

  const checkForHand = (handpose: HandPose, videoRef: HTMLVideoElement) => {
    if (!videoRef) return

    handpose.estimateHands(videoRef).then((predictions) => {
      if (predictions.length > 0) {
        console.log('Hand detected')
      }
    })
  }

  return <video ref={handleVideoRef} height={HEIGHT} width={WIDTH} autoPlay />
}

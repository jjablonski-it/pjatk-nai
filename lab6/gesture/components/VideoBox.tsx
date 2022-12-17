import { AnnotatedPrediction, HandPose, load as loadHandpose } from '@tensorflow-models/handpose'
import '@tensorflow/tfjs'
import { useCallback, useState } from 'react'
import {} from 'fingerpose'

const HEIGHT = 500
const WIDTH = 500

export const VideoBox = () => {
  const [emoji, setEmoji] = useState('🤷‍♀️')
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

  const checkForHand = async (handpose: HandPose, videoRef: HTMLVideoElement) => {
    if (!videoRef) return

    const prediction = await handpose.estimateHands(videoRef)
    if (prediction.length > 0) {
      const emoji = mapGestureToEmoji(prediction[0])
      emoji && setEmoji(emoji)
    }
  }

  return (
    <>
      <video ref={handleVideoRef} height={HEIGHT} width={WIDTH} autoPlay />
      <h1>{emoji}</h1>
    </>
  )
}

const mapGestureToEmoji = (prediction: AnnotatedPrediction) => {
  if (!prediction) {
    return '🤷‍♀️'
  }

  // Find the most confident hand gesture
  const mostConfidentIndex = prediction.landmarks.reduce((iMax, x, i, arr) => (x[0] > arr[iMax][0] ? i : iMax), 0)
  console.log(mostConfidentIndex)

  // Map the hand gesture to an emoji
  switch (mostConfidentIndex) {
    case 4:
    case 10:
    case 7:
    case 6:
      return '👍'
    case 8:
      return '✌️'
    // case 18:
    //   return '🖕'
    // case 12:
    //   return '👌'

    default:
      return null
  }
}

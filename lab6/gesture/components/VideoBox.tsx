import { AnnotatedPrediction, HandPose, load as loadHandpose } from '@tensorflow-models/handpose'
import '@tensorflow/tfjs'
import { useCallback, useRef, useState } from 'react'
import { drawHand } from '../utilities'

const HEIGHT = 500
const WIDTH = 500

export const VideoBox = () => {
  const [emoji, setEmoji] = useState('🤷‍♀️')
  const data = useRef<AnnotatedPrediction[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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
    }, 10)
  }

  const checkForHand = async (handpose: HandPose, videoRef: HTMLVideoElement) => {
    if (!videoRef) return
    const prediction = await handpose.estimateHands(videoRef)
    // console.log('prediction', prediction)
    if (prediction.length > 0) {
      // Transform predictions into hand emoji
      // const emoji = mapGestureToEmoji(prediction[0])
      // emoji && setEmoji(emoji)
    }
  }

  const mapGestureToEmoji = (prediction: AnnotatedPrediction) => {
    if (!prediction) {
      return '🤷‍♀️'
    }
    data.current.push(prediction)

    if (canvasRef.current) drawHand([prediction], canvasRef.current)
  }

  return (
    <>
      <video
        ref={handleVideoRef}
        height={HEIGHT}
        width={WIDTH}
        autoPlay
        style={{
          transform: 'scaleX(-1)',
          objectFit: 'cover',
          objectPosition: 'left',
        }}
      />
      <canvas
        ref={canvasRef}
        height={HEIGHT}
        width={WIDTH}
        style={{
          position: 'absolute',
          transform: 'scaleX(-1)',
        }}
      />
      <h1>{emoji}</h1>
      <button
        onClick={() => {
          console.log(data.current)
          data.current = []
        }}
      >
        Collect data
      </button>
    </>
  )
}

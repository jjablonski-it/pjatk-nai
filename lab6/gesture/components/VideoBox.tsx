import { AnnotatedPrediction, HandPose, load as loadHandpose } from '@tensorflow-models/handpose'
import '@tensorflow/tfjs'
import { useCallback, useRef, useState } from 'react'
import { drawHand } from '../utilities'
import fp from 'fingerpose'

const HEIGHT = 500
const WIDTH = 500
const DETECTION_INTERVAL = 100

const GA = new fp.GestureEstimator([fp.Gestures.VictoryGesture, fp.Gestures.ThumbsUpGesture])

export const VideoBox = () => {
  const [emoji, setEmoji] = useState('🤷‍♀️')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleVideoRef = useCallback(async (videoRef: HTMLVideoElement) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    })
    videoRef.srcObject = stream
    runHandpose(videoRef)
  }, [])

  /**
   * Runs the handpose model on the given video element. This function
   * is called every DETECTION_INTERVAL ms. It calls the checkForHand
   * function, which determines whether or not the hand is in the
   * frame and performs any other necessary actions or changes.
   * @param videoRef The video element to run the handpose model on
   */
  const runHandpose = async (videoRef: HTMLVideoElement) => {
    const handpose = await loadHandpose()
    console.log('Handpose model loaded')
    setInterval(() => {
      checkForHand(handpose, videoRef)
    }, DETECTION_INTERVAL)
  }

  /**
   * Checks for a hand in the video frame and draws it on the canvas
   * @param handpose the handpose model
   * @param videoRef the video element
   */
  const checkForHand = async (handpose: HandPose, videoRef: HTMLVideoElement) => {
    if (!videoRef) return
    const predictions = await handpose.estimateHands(videoRef)
    const prediction = predictions[0]
    if (predictions.length > 0) {
      // Draw hand landmarks
      if (canvasRef.current) drawHand([prediction], canvasRef.current)

      // Transform predictions into hand emoji
      const emoji = mapGestureToEmoji(prediction)
      if (emoji) setEmoji(emoji)
    }
  }

  /**
   * Maps a hand gesture to an emoji
   * @param prediction the handpose prediction
   * @returns the emoji
   */
  const mapGestureToEmoji = (prediction: AnnotatedPrediction) => {
    if (!prediction) {
      return '🤷‍♀️'
    }
    const gesture = GA.estimate(prediction.landmarks, 7.5)
    const mostProbableGesture = gesture.gestures.reduce(
      (prev: any, { name, score }: any) => {
        return score > prev.score ? { name, score } : prev
      },
      { name: 'unknown', score: 0 }
    )

    const gestureMap = {
      unknown: '🤷‍♀️',
      thumbs_up: '👍',
      victory: '✌️',
    } as const

    return gestureMap[mostProbableGesture.name as keyof typeof gestureMap]
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
    </>
  )
}

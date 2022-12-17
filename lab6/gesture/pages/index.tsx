import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { VideoBox } from '../components/VideoBox'

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={styles.main}>
        <VideoBox />
      </main>
    </>
  )
}

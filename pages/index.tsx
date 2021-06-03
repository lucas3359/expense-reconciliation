import Head from 'next/head'
import { signIn, signOut, useSession } from 'next-auth/client'
import UploadFile from '../components/uploadFile'
import Card from '../components/Card'
import Layout from '../components/Layout'

export default function Home({}) {
  const [session, loading] = useSession()

  return (
    <Layout>
      <Head>
        <title>Expenses Reconciliation</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {!session && (
        <>
          Not signed in <br />
        </>
      )}
      {session && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols:3 px-5 md:gap-3 gap-y-7'>
          <Card title='Upload'>
            <p>Get started by uploading files</p>
          </Card>

          <Card title='Reconcile Page' link='/list'>
            <p>Go through each transaction to do the splitting</p>
          </Card>

          <Card title='Category Page'>
            <p>Group transactions into set groups</p>
          </Card>

          <Card title='Dashboard page'>
            <p>Discover the past spending on different categories </p>
          </Card>
        </div>
      )}
    </Layout>
  )
}

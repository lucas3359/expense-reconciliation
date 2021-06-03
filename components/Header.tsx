import { useSession } from 'next-auth/client'
import Link from 'next/link'
import React from 'react'
import Icon from './Icon'

const Header = () => {
  const [session, loading] = useSession()

  return (
    <header className='text-gray-700 bg-white bg-opacity-25 w-full flex h-14 py-2 px-2'>
      <div className='flex-1'>
        <Link href='/'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={'h-8 w-8 my-1 cursor-pointer'}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </Link>
      </div>
      <div className='flex-1 items-center justify-center leading-10 text-xl'>Home</div>
      <div className={`flex-initial ${session && session.user ? 'text-blue-600' : ''}`}>
        <Icon icon='profile' classes='h-10 w-10' />
      </div>
    </header>
  )
}

export default Header

'use client'

import React from 'react'

import { useSelector } from 'react-redux'

import type { GlobalTypes } from '@/types/globalTypes'
import { cn } from '@/utils/cn'

import Header from '../molecules/Header'
import Sidebar from '../molecules/Sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const collapsed = useSelector((state: GlobalTypes) => state.global.sidebarCollapsed)

  console.log(collapsed, 'collapsed')

  return (
    <div>
      <Sidebar />
      <div className="overflow-x-hidden">
        <div
          className={cn(
            collapsed
              ? 'left-[80px] w-[calc(100%_-_80px)]'
              : 'left-0 w-full lg:left-[250px] lg:w-[calc(100%_-_250px)]',
            'transition-width-left absolute duration-300'
          )}
        >
          <Header />
          <div className="bg-background min-h-[calc(100vh_-_70px)] p-3 lg:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout

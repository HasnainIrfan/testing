import { useSelector } from 'react-redux'

import { Logo, SmallLogo } from '@/assets/Images'
import type { GlobalTypes } from '@/types/globalTypes'
import { cn } from '@/utils/cn'

// import HamburgurMenu from '../atoms/HamburgurMenu'

const Sidebar = () => {
  const { sidebarOpen: isOpen, sidebarCollapsed: collapsed } = useSelector(
    (state: GlobalTypes) => state.global
  )

  return (
    <div
      className={cn(
        'transition-width-transform bg-primary shadow-sidebar fixed left-0 z-30 h-screen px-3.5 py-6 duration-300',
        collapsed ? 'w-[80px]' : 'w-[250px]',
        isOpen ? 'translate-x-0' : '-translate-x-[240px] lg:translate-x-0'
      )}
    >
      <div className="mb-12 flex items-center justify-between px-2">
        <img src={collapsed ? SmallLogo : Logo} alt="logo" />
      </div>
    </div>
  )
}

export default Sidebar

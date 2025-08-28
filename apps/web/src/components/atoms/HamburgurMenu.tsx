import { useDispatch, useSelector } from 'react-redux'

import { setSidebarCollapsed } from '@/redux/slice/reducers/global.reducer'
import type { GlobalTypes } from '@/types/globalTypes'
import { cn } from '@/utils/cn'

const HamburgurMenu = () => {
  const dispatch = useDispatch()
  const { sidebarCollapsed } = useSelector((state: GlobalTypes) => state.global)

  const open = sidebarCollapsed

  return (
    <div
      className="hidden h-8 w-8 cursor-pointer flex-col items-center justify-between px-1 py-[7px] lg:flex"
      onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
    >
      <div
        className={cn(
          'bg-primary h-[3px] w-full rounded-2xl duration-500',
          open ? 'translate-y-[7px] rotate-[223deg] transform' : ''
        )}
      />
      <div className={cn('bg-primary h-[3px] w-full rounded-2xl', open ? 'hidden' : 'block')} />
      <div
        className={cn(
          'bg-primary h-[3px] w-full rounded-2xl duration-500',
          open ? 'translate-y-[-8px] -rotate-[223deg] transform' : ''
        )}
      />
    </div>
  )
}

export default HamburgurMenu

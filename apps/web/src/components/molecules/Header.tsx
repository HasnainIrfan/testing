import HamburgurMenu from '../atoms/HamburgurMenu'

const Header = () => {
  return (
    <div className="text-primary sticky z-[19] flex h-[70px] flex-grow-0 items-center gap-3 bg-white px-3">
      <HamburgurMenu />
      Header
    </div>
  )
}

export default Header

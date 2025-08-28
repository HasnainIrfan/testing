import React from 'react'

import { Modal as AntdModal } from 'antd'
import { IoIosCloseCircleOutline } from 'react-icons/io'

import Text from './Text'

type ModelProps = {
  title?: string
  open: boolean
  children: React.ReactNode
  handleClose?: () => void
  width?: number
  closeIcon?: boolean
  onHeaderChildren?: React.ReactNode
  bgColor?: 'Primary' | 'white' | 'secondary'
}

// Model component that displays a modal dialog.
function Modal({
  title,
  open,
  handleClose,
  children,
  width,
  closeIcon = true,
  onHeaderChildren,
  bgColor,
}: ModelProps) {
  return (
    <AntdModal
      open={open}
      centered
      footer={null}
      closable={false}
      width={width}
      className={
        bgColor === 'Primary'
          ? 'model-primary'
          : bgColor === 'secondary'
            ? 'model-secondary'
            : 'model-white'
      }
    >
      {/* Header */}
      {title ? (
        <div className="absolute left-0 top-0 flex w-full items-center justify-between rounded-t-[8px] px-4 py-3">
          <Text containerTag="h3" className="text-base font-semibold text-white sm:text-lg">
            {title}
          </Text>

          {/* Close button */}
          {closeIcon && (
            <div
              className="text-blackColor cursor-pointer text-xl duration-200 hover:rotate-180 hover:duration-200 sm:text-2xl"
              onClick={handleClose}
            >
              <IoIosCloseCircleOutline />
            </div>
          )}

          {onHeaderChildren}
        </div>
      ) : (
        <div
          className="text-blackColor absolute right-5 top-5 cursor-pointer text-xl duration-200 hover:rotate-180 hover:duration-200 sm:text-2xl"
          onClick={handleClose}
        >
          <IoIosCloseCircleOutline />
        </div>
      )}

      {/* Main content */}
      <div className="overflow-hidden">{children}</div>
    </AntdModal>
  )
}

export default Modal

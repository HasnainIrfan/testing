import React from 'react'

import { Button } from 'antd'
import { PiWarningCircleThin } from 'react-icons/pi'

import Model from './Modal'
import Text from './Text'

type PropsTypes = {
  open: boolean
  setOpen: (isOpen: boolean) => void
  onDelete?: () => void
  loading?: boolean
  title?: string
  buttonContent?: string
  isContent?: boolean
  children?: React.ReactNode
  actions?: boolean
  closeIcon?: boolean
}

function ConfrimModel({
  open,
  setOpen,
  onDelete,
  loading,
  title,
  buttonContent,
  children,
  isContent = true,
  actions = true,
  closeIcon = true,
}: PropsTypes) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Model
      title={title || 'Delete User'}
      open={open}
      handleClose={handleClose}
      closeIcon={closeIcon}
    >
      <div className="relative my-12 flex w-full flex-col items-center pb-16">
        {isContent && (
          <>
            <PiWarningCircleThin className="text-red mb-5" size={60} />

            <Text
              containerTag="h2"
              className="text-blackColor mb-2 text-center text-lg font-semibold sm:text-2xl"
            >
              Are you sure?
            </Text>

            <Text
              containerTag="h5"
              className="text-lightRed mb-2 text-center text-sm font-semibold sm:text-base"
            >
              You won't be able to revert this!
            </Text>
          </>
        )}
        {children}

        {actions && (
          <div className="absolute bottom-[-10px] mt-6 flex w-full flex-col items-center justify-center gap-1 sm:flex-row sm:gap-5">
            <Button
              className="w-[200px] bg-gray-100"
              disabled={loading}
              onClick={handleClose}
              type="text"
              size="large"
            >
              Cancel
            </Button>
            <Button
              className="w-[200px]"
              variant="solid"
              type="primary"
              size="large"
              danger
              onClick={onDelete}
              loading={loading}
              disabled={loading}
            >
              {buttonContent || 'Yes, delete it!'}
            </Button>
          </div>
        )}
      </div>
    </Model>
  )
}

export default ConfrimModel

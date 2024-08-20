import React from 'react'
import MaterialReceiptComponent from '../../components/MaterialReceipt'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'T-1 Report',
  description: "T-1 Material Kitting Rate"
}

const MaterialT1Page = () => {
  return (
    <MaterialReceiptComponent />
  )
}

export default MaterialT1Page
import { formatNumber } from '@/lib/helper/number'
import Image from 'next/image'
import React from 'react'

interface Props {
  title: string
  iconSrc: string
  currency: string
  price: number
}

const PriceInfoCard = ({title, iconSrc, currency, price}: Props) => {
  return (
    <div className={`price-info_card`}>
        <p className='text-base text-black-100'>{title}</p>
        <div className='flex gap-1'>
            <Image src={iconSrc} alt={title} width={24} height={24}/>
            <p className='text-2xl font-bold text-secondary'>{`${currency} ${formatNumber(price)}`}</p>
        </div>
    </div>
  )
}

export default PriceInfoCard
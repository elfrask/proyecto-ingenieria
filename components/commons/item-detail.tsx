import React from 'react'

interface Props {
  title: string
  description: string | number
  colSpan?: string | number
}

function ItemDetail({ title, description, colSpan }: Props) {
  return (
    <div className={`${colSpan ? colSpan : 'col-span-1'} grid gap-1`}>
      <h2 className='text-xs md:text-sm font-bold'>{title}</h2>
      <p className='text-xs md:text-sm'>{description}</p>
    </div>
  )
}

export default ItemDetail
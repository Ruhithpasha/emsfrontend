import React from 'react'

const FailedTask = ({data}) => {
  return (
    <div className=' flex-shrink-0 w-[333.5px] h-full bg-yellow-500 rounded-lg p-8 '>
                <div className='flex items-center justify-between'>
                    <h1 className='bg-red-500 rounded-md px-1 font-semibold '>{data.category}</h1>
                    <h3 className='font-semibold text-sm' >{data.taskDate}</h3>
                </div>
                <h1 className='mt-5 text-2xl font-bold'>{data.taskTitle}</h1>
                <p className='mt-2'>{data.taskDescription} </p>

                <button className="px-4 py-1 text-sm mt-2 mr-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
           Failed
        </button>
        </div>
  )
}

export default FailedTask
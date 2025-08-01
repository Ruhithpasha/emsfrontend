import React from 'react'

const TaskListNumber = ({data}) => {


     
  return (
    <div className='flex mt-10 justify-between gap-5 screen  '>
        <div className='bg-red-500 rounded-xl py-6 px-9 w-[45%]'>
             <h1 className='text-3xl font-semibold'>{data.taskCounts.newTask}</h1>
             <h2 className='text-xl font-medium'>New Task</h2>
        </div>
        <div className='bg-emerald-500 rounded-xl py-6 px-9 w-[45%]'>
             <h1 className='text-3xl font-semibold'>{data.taskCounts.completed}</h1>
             <h2 className='text-xl font-medium'>Completed</h2>
        </div>
        <div className='bg-blue-500 rounded-xl py-6 px-9 w-[45%]'>
             <h1 className='text-3xl font-semibold'>{data.taskCounts.active}</h1>
             <h2 className='text-xl font-medium'>Active</h2>
        </div>
        <div className='bg-yellow-500 rounded-xl py-6 px-9 w-[45%]'>
             <h1 className='text-3xl font-semibold'>{data.taskCounts.failed}</h1>
             <h2 className='text-xl font-medium'>Failed</h2>
        </div>

    </div>
  )
}

export default TaskListNumber
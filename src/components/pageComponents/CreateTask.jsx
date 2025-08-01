import React from 'react'

const CreateTask = () => {



  const submitHandler =(e)=>{
     e.preventDefault();
     console.log("taskCreated")
  }
  return (
    <div className='p-5 bg-[#1c1c1c] mt-7 rounded'>
          <form onSubmit={(e)=>{
            submitHandler(e)
          }} className='flex items-start justify-between flex-wrap w-full'>
              <div className='w-1/2'> 
                  <div>
                    <h3 className='text-sm text-gray-300 mb-0.5'>Task Title</h3>
                    <input type="text" className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' placeholder='Enter the title'/>
                  </div>

                  <div>
                    <h3 className='text-sm text-gray-300 mb-0.5'>Date</h3>
                    <input type="date" className=' text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4'/>
                  </div>
                  <div>
                    <h3 className='text-sm border-spacing-0.5 text-gray-300'>Asign to</h3>
                    <input type="text" className='text-sm bg-transparent border-[1px]  border-gray-400 w-4/5 rounded outline-none py-1 px-2 mb-4' placeholder='Enter Employee name' />
                  </div>
                  <div>
                    <h3 className='text-sm text-gray-300 mb-0.5'>Category</h3>
                    <input type="text" className='text-sm bg-transparent border-[1px] border-gray-400 w-4/5 py-1 px-2 outline-none mb-4 rounded' placeholder='Enter the Category' />
                  </div>
              </div>

              <div className='w-1/2 flex flex-col items-start'>
                <h3 className='text-sm text-gray-300 mb-0.5'>Description</h3>
                <textarea name="" id="" className='w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4'></textarea>
                <button className='bg-emerald-500 py-3 hover:bg-emerald-700 rounded text-sm mt-4 w-full'>Create Task</button>
              </div>
          </form>
        </div>
  )
}

export default CreateTask
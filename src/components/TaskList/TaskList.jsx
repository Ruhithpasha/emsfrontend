import React from 'react'
import AcceptTask from './AcceptTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'
import NewTask from './NewTask'

const TaskList = ({ data }) => {
    return (
        <div id='tasklist' className='overflow-x-auto h-[55%] w-full mt-10 rounded-md py-5 flex items-center justify-start gap-6'>



            {data.tasks.map((elem,idx) => {

                if (elem.active) {
                    return <AcceptTask key={idx} data ={elem}/>
                }
                if (elem.completed) {
                    return <CompleteTask key={idx} data ={elem}/>
                }
                if (elem.failed) {
                    return <FailedTask key={idx} data ={elem} />
                }
                if(elem.newTask){
                    return <NewTask key={idx} data ={elem} />
                }
            })}




        </div>
    )
}

export default TaskList
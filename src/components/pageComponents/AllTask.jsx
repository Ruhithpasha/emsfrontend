import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import apiService from '../../services/apiService'

const AllTask = () => {
    const { userData } = useContext(AuthContext)
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true)
                const response = await apiService.getAllEmployees()
                setEmployees(response)
                setError(null)
            } catch (error) {
                console.error('Error fetching employees:', error)
                setError('Failed to fetch employees')
            } finally {
                setLoading(false)
            }
        }

        // Only fetch if user is admin
        if (userData && userData.role === 'admin') {
            fetchEmployees()
        }
    }, [userData])

    if (loading) {
        return (
            <div id='Alltask' className='bg-[#1c1c1c] p-5 rounded mt-5'>
                <div className='flex items-center justify-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400'></div>
                    <span className='text-white ml-2'>Loading employees...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div id='Alltask' className='bg-[#1c1c1c] p-5 rounded mt-5'>
                <div className='text-red-400 text-center py-8'>
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div id='Alltask' className='bg-[#1c1c1c] p-5 rounded mt-5'>
            <div className='bg-red-400 mb-2 py-2 px-4 flex justify-between rounded'>
                <h2 className='text-lg font-medium w-1/5'>Employee Name</h2>
                <h3 className='text-lg font-medium w-1/5'>New Task</h3>
                <h5 className='text-lg font-medium w-1/5'>Active Task</h5>
                <h5 className='text-lg font-medium w-1/5'>Completed</h5>
                <h5 className='text-lg font-medium w-1/5'>Failed</h5>
            </div>
           
            <div className=''>
                {employees.length === 0 ? (
                    <div className='text-gray-400 text-center py-8'>
                        No employees found
                    </div>
                ) : (
                    employees.map(function(elem, idx){
                        return (
                            <div key={elem._id || idx} className='border-2 border-emerald-500 mb-2 py-2 px-4 flex justify-between rounded'>
                                <h2 className='text-lg font-medium w-1/5'>{elem.firstName}</h2>
                                <h3 className='text-lg font-medium w-1/5 text-blue-400'>{elem.taskCounts.newTask}</h3>
                                <h5 className='text-lg font-medium w-1/5 text-yellow-400'>{elem.taskCounts.active}</h5>
                                <h5 className='text-lg font-medium w-1/5 text-white'>{elem.taskCounts.completed}</h5>
                                <h5 className='text-lg font-medium w-1/5 text-red-600'>{elem.taskCounts.failed}</h5>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default AllTask
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';


const CustomersHeader = () => {
    return (
            <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
                <Link to="/user/create" className="btn btn-primary">
                    <FiPlus size={16} className='me-2' />
                    <span>Create user</span>
                </Link>
            </div>
    )
}

export default CustomersHeader
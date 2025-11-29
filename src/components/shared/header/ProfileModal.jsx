import React from 'react'
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi"
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';

const ProfileModal = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be logout!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        });

    }
    return (
        <div className="dropdown nxl-h-item">
            <a href="#" data-bs-toggle="dropdown" role="button" data-bs-auto-close="outside">
                <img src="/images/avatar/1.png" alt="user-image" className="img-fluid user-avtar me-0" />
            </a>
            <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
                <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                        <img src="/images/avatar/1.png" alt="user-image" className="img-fluid user-avtar" />
                        <div>
                            <h6 className="text-dark mb-0">Alexandra Della <span className="badge bg-soft-success text-success ms-1">Admin</span></h6>
                            <span className="fs-12 fw-medium text-muted">alex.della@outlook.com</span>
                        </div>
                    </div>
                </div>
                {/* <div className="dropdown-divider"></div> */}
                {/* <div className="dropdown-divider"></div> */}
                <a href="#" className="dropdown-item">
                    <i ><FiUser /></i>
                    <span>Profile Details</span>
                </a>
                {/* <a href="#" className="dropdown-item">
                    <i><FiSettings /></i>
                    <span>Account Settings</span>
                </a> */}
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item">
                    <i> <FiLogOut /></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default ProfileModal

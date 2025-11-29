import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const CustomerCreateContent = () => {
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        password: "",
        role: ""
    })
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://api.wizbizlaonboard.com/api/users/add', values);
            if (res.data.success) {
                toast.success("User registered successfully");
                navigate('/user/list');
            } else {
                toast.error(res.data.message || "adding failed");
            }
        } catch (error) {
            console.log("error handle Submit data", error);
            toast.error(error.response?.data?.message || "Server error");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Add Users</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-sm-6">
                                <label htmlFor='firstName' className="col-sm-2 col-form-label">First Name</label>
                                <input type="text" className="form-control" placeholder="First Name" name='firstName' value={values.firstName} onChange={handleChange} />
                            </div>
                            <div className="col-sm-6">
                                <label className="col-sm-2 col-form-label">Last Name</label>
                                <input type="text" className="form-control" placeholder="last Name" name='lastName' value={values.lastName} onChange={handleChange} />
                            </div>
                            <div className="col-sm-6">
                                <label className="col-sm-2 col-form-label">Email</label>
                                <input type="email" className="form-control" placeholder="Email Address" name='email' value={values.email} onChange={handleChange} />
                            </div>
                            <div className="col-sm-6">
                                <label className="col-sm-2 col-form-label">Contact Number</label>
                                <input type="number" className="form-control" placeholder="Contact Number" name='contactNumber' value={values.contactNumber} onChange={handleChange} />
                            </div>
                            <div className="col-sm-6">
                                <label className="col-sm-2 col-form-label">Password</label>
                                <input type="password" className="form-control" placeholder="***********" name='password' value={values.password} onChange={handleChange} />
                            </div>
                            <div className="col-sm-6">
                                <label className="col-sm-2 col-form-label">role</label>
                                <select className="form-select" name='role' value={values.role} onChange={handleChange}>
                                    <option value="">Select Role</option>
                                    <option value="consumer">Consumer</option>
                                    <option value="provider">Provider</option>

                                </select>
                            </div>
                        </div>
                        <div className="text-end d-flex justify-content-end">
                            <button type='submit' className="btn btn-primary">Save</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default CustomerCreateContent
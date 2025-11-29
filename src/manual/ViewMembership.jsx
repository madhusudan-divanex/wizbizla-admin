import CustomerCreateContent from '@/components/customersCreate/CustomerCreateContent'
import CustomersCreateHeader from '@/components/customersCreate/CustomersCreateHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSecureApiData, postApiData, updateApiData } from '../Services/api'
import { toast } from 'react-toastify'

function ViewMembership() {
    const { id } = useParams();
    const [values, setValues] = useState({
        name: "",
        description: "",
        features: [{ title: '', detail: '' }],
        price: { monthly: 0, yearly: 0 },
        btnText: "",
        type: "",
        topChoice: false
    })
    const navigate = useNavigate();
    const fetchMemberShipData = async () => {
        try {
            const result = await getSecureApiData(`get-membership-data/${id}`)
            if (result.status) {
                setValues(result.membershipData || {})
            }
        } catch (error) {
            console.log("error fetching profile data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    useEffect(() => {
        fetchMemberShipData();
    }, []);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'monthly' || name === 'yearly') {
            setValues((prev) => ({
                ...prev,
                price: {
                    ...prev.price,
                    [name]: value
                }
            }));
        } else if (type === 'checkbox') {
            setValues((prev) => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFeatureChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFeatures = [...values.features];
        updatedFeatures[index][name] = value;
        setValues((prev) => ({
            ...prev,
            features: updatedFeatures
        }));
    };
    const handleRemoveFeature = (index) => {
        setValues((prev) => {
            const updated = [...prev.features];
            updated.splice(index, 1);
            return {
                ...prev,
                features: updated.length > 0 ? updated : [{ title: '', detail: '' }] // always keep at least 1
            };
        });
    };
    // Add new feature input
    const handleAddFeature = (e) => {
        e.preventDefault();
        setValues((prev) => ({
            ...prev,
            features: [...prev.features, { title: '', detail: '' }]
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...values, membershipId: id, features: JSON.stringify(values.features), price: JSON.stringify(values.price) }
        try {
            const result = await updateApiData('update-membership', data)
            if (result.status) {
                toast.success("Membership updated successfully");
                navigate('/membership');
            } else {
                toast.error(result.message || "adding failed");
            }
        } catch (error) {
            console.log("error handle Submit data", error);
            toast.error(error.response?.data?.message || "Server error");
        }
    };
    return (
        <>
            <PageHeader>
                <CustomersCreateHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <div className="container mt-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Membership Detail</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-sm-6">
                                            <label htmlFor='name' className="col-sm-2 col-form-label">Name</label>
                                            <input type="text" className="form-control" placeholder="Name" required name='name' value={values.name} onChange={handleChange} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Button Heading</label>
                                            <input type="text" className="form-control" placeholder="" name='btnText' value={values.btnText} onChange={handleChange} />
                                        </div>
                                        <h5>Price</h5>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Price (per month)</label>
                                            <input type="number" className="form-control" placeholder="" name='monthly' value={values.price.monthly} onChange={handleChange} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Price (per year)</label>
                                            <input type="number" className="form-control" placeholder="" name='yearly' value={values.price.yearly} onChange={handleChange} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Type</label>
                                            <select className="form-select" name='type' value={values.type} required onChange={handleChange}>
                                                <option value="">Select Type</option>
                                                <option value="consumer">Consumer</option>
                                                <option value="provider">Provider</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-form-label">Highlight this?</label>
                                            <input
                                                type="checkbox"
                                                className="form-control-checkbox"
                                                name="topChoice"
                                                checked={values.topChoice}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Description</label>
                                            <textarea rows={3} className="form-control" placeholder="" name='description' value={values.description} onChange={handleChange} />
                                        </div>
                                        <h5>Features</h5>
                                        {values?.features.map((item, index) => (
                                            <div className="row mb-2" key={index}>
                                                <div className="col-sm-4">
                                                    <label className="form-label">Title</label>
                                                    <input
                                                        type='text'
                                                        required
                                                        className="form-control"
                                                        name='title'
                                                        value={item.title}
                                                        onChange={(e) => handleFeatureChange(index, e)}
                                                    />
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="form-label">Detail</label>
                                                    <input
                                                        type='text'
                                                        required
                                                        className="form-control"
                                                        name='detail'
                                                        value={item.detail}
                                                        onChange={(e) => handleFeatureChange(index, e)}
                                                    />
                                                </div>
                                                {index !== 0 && <div className="col-sm-4 mt-4">
                                                    <button className="btn btn-danger" onClick={() => handleRemoveFeature(index)}>Remove Feature</button>
                                                </div>}
                                            </div>
                                        ))}
                                        <div className="mb-3">
                                            <button className="btn btn-secondary" type='button' onClick={handleAddFeature}>Add Feature</button>
                                        </div>
                                    </div>
                                    <div className="text-end d-flex justify-content-between">
                                        <Link to='/membership' className="btn btn-secondary">Close</Link>
                                        <button type='submit' className="btn btn-primary">Update</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewMembership

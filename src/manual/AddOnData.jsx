import CustomerCreateContent from '@/components/customersCreate/CustomerCreateContent'
import CustomersCreateHeader from '@/components/customersCreate/CustomersCreateHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getSecureApiData, postApiData, updateApiData } from '../Services/api'
import { toast } from 'react-toastify'

function AddOnData() {
    const [searchParam] = useSearchParams()
    const [id, setId] = useState(null)
    const [isEdit,setIsEdit]=useState(false)
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: 0,
        type: "",
        addonType:''

    })
    const navigate = useNavigate();
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
        if(isEdit){
            const data={...values,addOnId:id}
            try {
                const result = await updateApiData('update-addon', data)
                if (result.status) {
                    toast.success("Add on updated successfully");
                    navigate('/add-on-services');
                } else {
                    toast.error(result.message || "adding failed");
                }
            } catch (error) {
                console.log("error handle Submit data", error);
                toast.error(error.response?.data?.message || "Server error");
            }
        }else{
            try {
                const result = await postApiData('create-addon', values)
                if (result.status) {
                    toast.success("Add on created successfully");
                    navigate('/add-on-services');
                } else {
                    toast.error(result.message || "adding failed");
                }
            } catch (error) {
                console.log("error handle Submit data", error);
                toast.error(error.response?.data?.message || "Server error");
            }
        }
    };
    const fetchAddOnData = async () => {
        try {
            const result = await getSecureApiData(`get-addon-data/${id}`)
            if (result.status) {
                setValues(result.addOnData || {})
            }
        } catch (error) {
            console.log("error fetching profile data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    useEffect(() => {
        if (searchParam.get('id')) {
            fetchAddOnData();
            setIsEdit(true)
        }
    }, [id]);
    useEffect(() => {
        console.log(searchParam.get('id'))
        const queryId = searchParam.get('id');
        setId(queryId);
    }, [searchParam]);

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
                                <h5 className="mb-0">Add on Data</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-sm-6">
                                            <label htmlFor='name' className="col-sm-2 col-form-label">Name</label>
                                            <input type="text" className="form-control" placeholder="Name" required name='name' value={values.name} onChange={handleChange} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Price </label>
                                            <input type="number" className="form-control" placeholder="" name='price' value={values.price} onChange={handleChange} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Base For Price (AED 200/request)</label>
                                            <select className="form-select" name='type' value={values.type} required onChange={handleChange}>
                                                <option value="">Select Type</option>
                                                <option value="case">Case</option>
                                                <option value="request">Request</option>
                                                <option value="study">Study</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Add on type</label>
                                            <select className="form-select" name='addonType' value={values.addonType} required onChange={handleChange}>
                                                <option value="">Select Type</option>
                                                <option value="dispute">Dispute</option>
                                                <option value="bespoke">Bespoke</option>
                                                <option value="customize">Customized </option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Description</label>
                                            <textarea rows={3} className="form-control" placeholder="" name='description' value={values.description} onChange={handleChange} />
                                        </div>
                                        
                                    </div>
                                    <div className="text-end d-flex justify-content-end">
                                        <button type='submit' className="btn btn-primary">Save</button>
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

export default AddOnData

import CustomerCreateContent from '@/components/customersCreate/CustomerCreateContent'
import CustomersCreateHeader from '@/components/customersCreate/CustomersCreateHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getSecureApiData, postApiData, updateApiData } from '../Services/api'
import { toast } from 'react-toastify'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import base_url from '../baseUrl'

function CategoryData() {
    const [searchParam] = useSearchParams()
    const [options, setOptions] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [id, setId] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [values, setValues] = useState({
        name: "",
        subCat: [],
        image: null,
        imagepreview: null,
        icon: null,
        iconPreview: null,
    })
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setValues((prev) => ({
                    ...prev,
                    [name]: file,
                    [`${name}Preview`]: reader.result,
                }));
            };
            reader.readAsDataURL(file);
            return;
        } else {
            setValues((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData()
        data.append('name', values.name)
        data.append('image', values?.image)
        data.append('icon', values.icon)
        data.append('subCat', JSON.stringify(values.subCat))
        if (isEdit) {
            data.append('catId', id)
            try {
                const result = await updateApiData('update-category', data)
                if (result.status) {
                    toast.success("Category updated successfully");
                    navigate('/category');
                } else {
                    toast.error(result.message || "adding failed");
                }
            } catch (error) {
                console.log("error handle Submit data", error);
                toast.error(error.response?.data?.message || "Server error");
            }
        } else {
            try {
                const result = await postApiData('create-category', data)
                if (result.status) {
                    toast.success("Category created successfully");
                    navigate('/category');
                } else {
                    toast.error(result.message || "adding failed");
                }
            } catch (error) {
                console.log("error handle Submit data", error);
                toast.error(error.response?.data?.message || "Server error");
            }
        }
    };
    const fetchCategoryData = async () => {
        try {
            const result = await getSecureApiData(`get-category-data/${id}`)
            if (result.status) {
                const data = result.categoryData
                const subCatFormatted = data?.subCat ? data.subCat.map(item => ({
                    label: item?.name,   // Text to display
                    value: item?._id    // Value to use for selection
                })) : [];
                setValues({ ...values, name: data.name, image: data.image,icon:data?.icon, subCat: subCatFormatted })
            }
        } catch (error) {
            console.log("error fetching profile data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    useEffect(() => {
        if (id) {
            fetchCategoryData();
            setIsEdit(true)
        }
        fetchSubCategory()
    }, [id]);
    useEffect(() => {
        console.log(searchParam.get('id'))
        const queryId = searchParam.get('id');
        setId(queryId);
    }, [searchParam]);
    const handleSubCatChange = (selected) => {
        setValues((prevValues) => ({
            ...prevValues,
            subCat: selected,
        }));
    };
    const fetchSubCategory = async () => {
        try {
            const result = await getSecureApiData('get-subcategory')
            if (result.status) {
                setSubCategoryList(result.categoryData)
            } else {
                toast.error(result.message)
            }

        } catch (error) {
            console.log("error fetch categorys", error);
        }
    }
    useEffect(() => {
        if (subCategoryList?.length > 0) {
            const data = subCategoryList.map(sub => ({
                value: sub._id,
                label: sub.name
            }));
            setOptions(data)
        }
    }, [subCategoryList])

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
                                <h5 className="mb-0">Category Data</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-sm-12">
                                            <label htmlFor='name' className="col-sm-2 col-form-label">Name</label>
                                            <input type="text" className="form-control" placeholder="Name" required name='name' value={values.name} onChange={handleChange} />
                                        </div>
                                        <div className="col-sm-12">
                                            <label className="col-sm-2 col-form-label">Sub Category </label>
                                            <CreatableSelect
                                                isMulti
                                                className="w-100 custom-select"
                                                placeholder="Type sub-category and press Enter"
                                                value={values.subCat}
                                                onChange={handleSubCatChange}
                                                options={options}
                                                isValidNewOption={() => false}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuList: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                        overflowY: 'auto',
                                                    }),
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Image</label>
                                            <input
                                                type='file'
                                                className="form-control"
                                                name='image'
                                                accept="image/*"
                                                required={!values?.image}
                                                onChange={handleChange} />
                                        </div>

                                        {values?.imagePreview && (
                                            <div style={{ marginTop: "10px" }}>
                                                <img src={values.imagePreview} alt="Image preview" style={{ maxWidth: "50%", }} />
                                            </div>
                                        )}
                                        {!values?.imagePreview && values?.image?.startsWith('uploads') && (
                                            <div style={{ marginTop: "10px" }}>
                                                <img src={`${base_url}/${values.image}`} alt="Image preview" style={{ maxWidth: "50%", }} />
                                            </div>
                                        )}
                                        <div className="col-sm-6">
                                            <label className="col-sm-2 col-form-label">Icon</label>
                                            <input
                                                type='file'
                                                className="form-control"
                                                name='icon'
                                                accept="image/*"
                                                required={!values?.icon}
                                                onChange={handleChange} />

                                        </div>
                                        {values?.iconPreview && (
                                            <div style={{ marginTop: "10px" }}>
                                                <img src={values.iconPreview} alt="Icon preview" style={{ maxWidth: "50%", }} />
                                            </div>
                                        )}
                                        {!values?.iconPreview && values?.icon?.startsWith('uploads') && (
                                            <div style={{ marginTop: "10px" }}>
                                                <img src={`${base_url}/${values.icon}`} alt="Icon preview" style={{ maxWidth: "50%", }} />
                                            </div>
                                        )}

                                    </div>
                                    <div className="text-end d-flex justify-content-between">
                                        <Link to='/category' className="btn btn-secondary">Back</Link>
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

export default CategoryData

import CustomersTable from '@/components/customers/CustomersTable'
import Footer from '@/components/shared/Footer'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Pagination from '@/components/Services/Pagination';
import { deleteApiData, getSecureApiData, postApiData, updateApiData } from '../Services/api';
import base_url from '../baseUrl';


function ScamTip() {
    const [tipData, setTipData] = useState(null);
    const [tipList, setTipList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "",
        image: null,
        previewImage: null,
        isFeatured: false,
        link: ''
    })

    const fetchTip = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(`cms/tips?page=${page}&limit=10`)
            if (result.success) {
                setTipList(result.data)
                setPages(result.page);
                setTotal(result.total);
            } else {
                toast.error(result.message)
            }
            // const res = await axios.get(`https://api.wizbizlaonboard.com/api/tips/all?page=${pageNumber}&q=${searchQuery}`);
            // if (res.data.success) {
            //     setTipList(res.data.tips || []);
            //     setPage(res.data.currentPage);
            //     setPages(res.data.totalPages);
            //     setTotal(res.data.totalTips);
            // }
        } catch (error) {
            console.log("error fetch tips", error);
        }
    }

    useEffect(() => {
        fetchTip();
    }, [page, search]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
        }
    };
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const result = await deleteApiData(`cms/tip/${id}`)
                    if (result.success) {
                        toast.success(result.message);
                        fetchTip();
                    }
                } catch (error) {
                    console.log("error delete tips", error)
                }
            }
        });
    }
    async function handleSubmit(e) {
        e.preventDefault()
        console.log(form)
        const dataToSubmit = new FormData();
        dataToSubmit.append('title', form.title);
        dataToSubmit.append('description', form.description);
        dataToSubmit.append('type', form.type);
        dataToSubmit.append('isFeatured', form.isFeatured);
        dataToSubmit.append('link', form.link);
        if (form.image) {
            dataToSubmit.append('image', form.image);
        }
        if (tipData && form._id) {
            dataToSubmit.append('tipId', form._id);
        }
        try {
            const response = form._id ? await updateApiData('cms/tip', dataToSubmit) : await postApiData('cms/tip', dataToSubmit)
            if (response.success) {
                setTipData(null);
                fetchTip();
                setForm({
                    title: "",
                    description: "",
                    type: "",
                    image: null,
                    previewImage: null,
                    isFeatured: false
                });
                toast.success("Data updated successfully")
            }
        } catch (error) {

        }
    }
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        // For file upload (image)
        if (type === "file") {
            const file = files[0];

            setForm(prev => ({
                ...prev,
                image: file,
                previewImage: file ? URL.createObjectURL(file) : null
            }));
            return;
        }

        // Checkbox (isFeatured)
        if (type === "checkbox") {
            setForm(prev => ({
                ...prev,
                [name]: checked
            }));
            return;
        }

        // Text, select, textarea
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {tipData ?
                <form onSubmit={handleSubmit} className='main-content'>
                    <div className="row mb-3">

                        <div className="col-sm-6">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-sm-6">
                            <label>Link</label>
                            <input
                                type="text"
                                className="form-control"
                                name="link"
                                value={form.link}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-sm-6">
                            <label>Type</label>
                            <select
                                className="form-control"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                            >
                                <option value="">Select Type</option>
                                <option value="book">Book</option>
                                <option value="youtube">YouTube</option>
                                <option value="instagram">Instagram</option>
                            </select>
                        </div>

                        <div className="col-sm-12">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                            ></textarea>
                        </div>

                        <div className="col-sm-6">
                            <label>Image</label>
                            <input
                                type="file"
                                className="form-control"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </div>

                        {form.previewImage && (
                            <div className="col-sm-6">
                                <label>Preview</label><br />
                                <img
                                    src={form.previewImage}
                                    alt="Preview"
                                    className="img-thumbnail"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                />
                            </div>
                        )}
                        {!form.previewImage && form.image && (
                            <div className="col-sm-6">
                                <label>Preview</label><br />
                                <img
                                    src={`${base_url}/${form.image}`}
                                    alt="Preview"
                                    className="img-thumbnail"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                />
                            </div>
                        )}

                        <div className="col-sm-6 mt-3">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={form.isFeatured}
                                    onChange={handleChange}
                                />
                                &nbsp; Is Featured?
                            </label>
                        </div>

                    </div>

                    <div className="col-12 d-flex justify-content-between gap-2">
                        <button type='submit' className='btn btn-secondary' onClick={() => setTipData(null)}>Back</button>

                        <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
                </form>
                : <div className='main-content'>
                    <div className='row'>
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Tips</h5>
                                    <div>
                                        {/* <input type='search' placeholder='search here...' value={search}
                                        onChange={handleSearchChange} /> */}
                                        <button onClick={() => setTipData(true)} className='btn btn-primary'>Create</button>
                                    </div>
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">S.No.</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Image</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Last Update</th>
                                                <th scope="col" >Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                tipList?.length > 0 ? (
                                                    tipList?.map((item, index) => {
                                                        return (
                                                            <tr key={item._id}>
                                                                <td>{(page - 1) * 10 + index + 1}</td>
                                                                <td>{item.title}</td>
                                                                <td>
                                                                    {item?.type}
                                                                </td>

                                                                <td><img width={100} height={50} src={`${base_url}/${item?.image}`} /></td>
                                                                <td>{item?.description?.slice(0, 70)}</td>
                                                                <td>{new Date(item?.updatedAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>
                                                                <td >
                                                                    <div className="d-flex justify-content-start gap-2">
                                                                        <button onClick={() => {
                                                                            setTipData(true);
                                                                            setForm(item)
                                                                        }} className="btn btn-sm btn-light"><FiEye /></button>
                                                                        <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(item._id)}><FiTrash2 /></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className='text-center'>No tip Found</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-between align-items-center p-2">
                                        <div className="text-muted">
                                            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} entries
                                        </div>
                                        <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            <Footer />
        </>
    )
}

export default ScamTip

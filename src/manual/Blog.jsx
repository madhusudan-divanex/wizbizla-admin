import CustomersTable from '@/components/customers/CustomersTable'
import Footer from '@/components/shared/Footer'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Pagination from '@/components/Services/Pagination';
import { deleteApiData, getSecureApiData, postApiData, updateApiData } from '../Services/api';
import base_url from '../baseUrl';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Blog() {
    const [searchParams] = useSearchParams()
    const [blogData, setBlogData] = useState(null);
    const [blogList, setBlogList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [categoryList, setCategoryList] = useState([])
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        title: "",
        description: "",
        catId: "",
        image: null,
        link: "",
        previewImage: null,
    })

    const fetchBlog = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(`cms/blogs?page=${page}&limit=10`)
            if (result.success) {
                setBlogList(result.data)
                setPages(result.page);
                setTotal(result.total);
            } else {
                toast.error(result.message)
            }
            // const res = await axios.get(`https://api.wizbizlaonboard.com/api/blogs/all?page=${pageNumber}&q=${searchQuery}`);
            // if (res.data.success) {
            //     setBlogList(res.data.blogs || []);
            //     setPage(res.data.currentPage);
            //     setPages(res.data.totalPages);
            //     setTotal(res.data.totalBlogs);
            // }
        } catch (error) {
            console.log("error fetch blogs", error);
        }
    }
    const fetchCategory = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(`cms/blog-category`)
            if (result.status) {
                setCategoryList(result.categoryData)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.log("error fetch blogs", error);
        }
    }
    useEffect(() => {
        if (searchParams.get('create')) {
            setBlogData(true);
        }
    }, [searchParams.get('create')]);
    useEffect(() => {
        fetchBlog();
    }, [page, search]);
    useEffect(() => {
        fetchCategory()
    }, [])

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
                    const result = await deleteApiData(`cms/blog/${id}`)
                    if (result.success) {
                        toast.success(result.message);
                        fetchBlog();
                    }
                } catch (error) {
                    console.log("error delete blogs", error)
                }
            }
        });
    }
    async function handleSubmit(e) {
        e.preventDefault()
        const dataToSubmit = new FormData();
        dataToSubmit.append('title', form.title);
        dataToSubmit.append('description', form.description);
        dataToSubmit.append('catId', form.catId);
        dataToSubmit.append('link',form.link)
        if (form.image) {
            dataToSubmit.append('image', form.image);
        }
        if (blogData && form._id) {
            dataToSubmit.append('blogId', form._id);
        }
        try {
            const response = form._id ? await updateApiData('cms/blog', dataToSubmit) : await postApiData('cms/blog', dataToSubmit)
            if (response.success) {
                setBlogData(null);
                fetchBlog();
                setForm({
                    title: "",
                    description: "",
                    catId: "",
                    image: null,
                    previewImage: null,
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
            {blogData ?
                <form onSubmit={handleSubmit} className='main-content'>
                    <div className="row mb-3">

                        <div className="col-sm-12">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-sm-12">
                            <label>Category</label>
                            <select
                                className="form-control"
                                name="catId"
                                required
                                value={form.catId}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {categoryList?.map((item, key) => <option key={key} value={item?._id}>{item?.name}</option>)}
                            </select>
                        </div>
                        <div className="col-sm-12">
                            <label>Link</label>
                            <input
                                type="text"
                                className="form-control"
                                name="link"
                                value={form.link}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-sm-12">
                            <label>Description</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={form.description}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setForm({ ...form, description: data });
                                }}
                                config={{
                                    // toolbar: [
                                    //     'heading', '|',
                                    //     'bold', 'italic', 'underline', '|',
                                    //     'bulletedList', 'numberedList', '|',
                                    //     'link', 'imageUpload', '|',
                                    //     'undo', 'redo','CodeBlock'
                                    // ],
                                    ckfinder: {
                                        uploadUrl: `${base_url}/upload/image`,
                                    },
                                    removePlugins: [
                                        'MediaEmbed', 'CodeBlock',
                                    ],
                                }}
                            />

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


                    </div>

                    <div className="col-12 d-flex justify-content-between gap-2">
                        <button type='submit' className='btn btn-secondary' onClick={() => setBlogData(null)}>Back</button>

                        <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
                </form>
                : <div className='main-content'>
                    <div className='row'>
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Blogs</h5>
                                    <div>
                                        {/* <input type='search' placeholder='search here...' value={search}
                                        onChange={handleSearchChange} /> */}
                                        <button onClick={() => {
                                            setForm({
                                                title: "",
                                                description: "",
                                                catId: "",
                                                image: null,
                                                previewImage: null,
                                            })
                                            setBlogData(true)
                                        }} className='btn btn-primary'>Create</button>
                                    </div>
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col"> S.No. </th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Category</th>
                                                <th scope="col">Image</th>
                                                <th scope="col">Last Update</th>
                                                <th scope="col" >Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                blogList?.length > 0 ? (
                                                    blogList?.map((item, index) => {
                                                        return (
                                                            <tr key={item._id}>
                                                                <td>{(page - 1) * 10 + index + 1}</td>
                                                                <td>{item.title}</td>
                                                                <td>
                                                                    {item?.catId?.name}
                                                                </td>

                                                                <td><img width={100} height={50} src={`${base_url}/${item?.image}`} /></td>
                                                                <td>{new Date(item?.updatedAt)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                                <td >
                                                                    <div className="d-flex justify-content-start gap-2">
                                                                        <button onClick={() => {
                                                                            setBlogData(true);
                                                                            setForm({ ...item, catId: item?.catId?._id })
                                                                        }} className="btn btn-sm btn-light"><FiEye /></button>
                                                                        <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(item._id)}><FiTrash2 /></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className='text-center'>No blog Found</td>
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

export default Blog

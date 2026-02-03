import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteApiData, getApiData, postApiData, updateApiData } from '../Services/api';
import Footer from '@/components/shared/Footer';
import PageHeader from '@/components/shared/pageHeader/PageHeader';

function HomeTitle() {
    const navigate = useNavigate();
    const [id,setId]=useState()
    const [isNew,setIsNew]=useState(false)
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        title: "",
        
    });

    /* ================= FETCH LIST ================= */
    const fetchList = async () => {
        try {
            const res = await getApiData("cms/home-header");
            if (res?.success) setItems(res.data || []);
            else toast.error("Market glance not found");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        }
    };


    useEffect(() => {

        fetchList();
    }, []);


    /* ================= UPDATE ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                title: form.title                
            };
            let res;
            if(id){
                payload.headerId=id
                 res = await updateApiData("cms/home-header", payload);
            }else{
                 res = await postApiData("cms/home-header", payload);

            }

            if (res?.success) {
                fetchList()
                toast.success("Home header inserted");
                setIsNew(false)
                setId()

            } else {
                toast.error(res?.message || "Update failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Update failed");
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async (deleteId) => {
        try {
            const res = await deleteApiData(
                `cms/home-header/${deleteId}`
            );
            if (res?.success) {
                toast.success("Deleted");
                fetchList();
            } else {
                toast.error(res?.message || "Delete failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Delete failed");
        }
    };
    return (
        <>
            <PageHeader />
            <div className="main-content">
                <div className="container-fluid">

                    {/* ================= LIST VIEW ================= */}
                    {(!id && !isNew) && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <h5>All Header Title</h5>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>{setForm({title:''})
                                        setIsNew(true)}}

                                >
                                    Add New
                                </button>
                            </div>

                            <div className="card-body table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Last Update</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length ? (
                                            items.map((s, i) => (
                                                <tr key={s._id}>
                                                    <td>{i + 1}</td>
                                                    <td>{s.title}</td>
                                                    <td>{new Date(s.createdAt)?.toLocaleDateString('en-GB')}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={() =>{                                                                    setId(s._id)
                                                                    setForm({title:s.title})
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(s._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No data found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ================= EDIT FORM ================= */}
                    {(id || isNew) && (
                        <div className="card">
                            <div className="card-header">
                                <h5>{id?'Edit':'Create'} Home Header Title</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} className="row">

                                    <div className="col-12 mb-3">
                                        <label>Title</label>
                                        <input
                                            className="form-control"
                                            value={form.title}
                                            onChange={(e) =>
                                                setForm({ ...form, title: e.target.value })
                                            }
                                        />
                                    </div>

                                    

                                    <div className="col-12 d-flex gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {setIsNew(false)
                                                setId()

                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default HomeTitle

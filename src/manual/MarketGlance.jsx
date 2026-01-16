/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteApiData, getApiData, updateApiData } from "../Services/api";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";

const MarketGlance = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        title: "",
        counters: [{ label: "", value: "" }],
        note: "",
        _id: null,
    });

    /* ================= FETCH LIST ================= */
    const fetchList = async () => {
        try {
            const res = await getApiData("cms/get-market-glance");
            if (res?.success) setItems(res.data || []);
            else toast.error("Market glance not found");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        }
    };

    /* ================= FETCH BY ID (EDIT MODE) ================= */
    const fetchById = async (sectionId) => {
        try {
            const res = await getApiData(`cms/get-market-glance/${sectionId}`);
            if (res?.success) {
                const data = res.data;
                setForm({
                    title: data.title || "",
                    counters:
                        Array.isArray(data.counters) && data.counters.length
                            ? data.counters.map((c) => ({
                                label: c.label || "",
                                value: c.value || "",
                            }))
                            : [{ label: "", value: "" }],
                    note: data.note || "",
                    _id: data._id,
                });
            } else {
                toast.error("Section not found");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        }
    };

    useEffect(() => {
        if (id) fetchById(id);
        else fetchList();
    }, [id]);

    /* ================= COUNTERS ================= */
    const addCounter = () =>
        setForm((prev) => ({
            ...prev,
            counters: [...prev.counters, { label: "", value: "" }],
        }));

    const removeCounter = (index) =>
        setForm((prev) => {
            const next = prev.counters.filter((_, i) => i !== index);
            return {
                ...prev,
                counters: next.length ? next : [{ label: "", value: "" }],
            };
        });

    const handleCounterChange = (index, key, value) =>
        setForm((prev) => {
            const next = [...prev.counters];
            next[index] = { ...next[index], [key]: value };
            return { ...prev, counters: next };
        });

    /* ================= UPDATE ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                sectionId: form._id,
                title: form.title,
                counters: form.counters
                    .filter((c) => c.label && c.value !== "")
                    .map((c) => ({
                        label: c.label,
                        value: Number(c.value),
                    })),
                note: form.note,
            };

            const res = await updateApiData("cms/update-market-glance", payload);

            if (res?.success) {
                toast.success("Market Glance updated");
                navigate("/cms/market-glance");
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
                `cms/delete-market-glance/${deleteId}`
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
                    {!id && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <h5>All Market at a Glance</h5>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate("/cms/market-glance-create")}
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
                                            <th>Counters</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length ? (
                                            items.map((s, i) => (
                                                <tr key={s._id}>
                                                    <td>{i + 1}</td>
                                                    <td>{s.title}</td>
                                                    <td>{s.counters?.length || 0}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={() =>
                                                                    navigate(`/cms/market-glance/${s._id}`)
                                                                }
                                                            >
                                                                Open
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
                    {id && (
                        <div className="card">
                            <div className="card-header">
                                <h5>Edit Market at a Glance</h5>
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

                                    <div className="col-12 mb-2">
                                        <label>Counters</label>
                                    </div>

                                    {form.counters.map((ctr, idx) => (
                                        <div key={idx} className="col-12 mb-2">
                                            <div className="row g-2">
                                                <div className="col-md-6">
                                                    <input
                                                        className="form-control"
                                                        placeholder="Label"
                                                        value={ctr.label}
                                                        onChange={(e) =>
                                                            handleCounterChange(
                                                                idx,
                                                                "label",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Value"
                                                        value={ctr.value}
                                                        onChange={(e) =>
                                                            handleCounterChange(
                                                                idx,
                                                                "value",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger w-100"
                                                        onClick={() => removeCounter(idx)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="col-12 mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={addCounter}
                                        >
                                            Add Counter
                                        </button>
                                    </div>

                                    <div className="col-12 mb-3">
                                        <label>Note</label>
                                        <textarea
                                            rows={3}
                                            className="form-control"
                                            value={form.note}
                                            onChange={(e) =>
                                                setForm({ ...form, note: e.target.value })
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
                                            onClick={() => navigate("/cms/market-glance")}
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
    );
};

export default MarketGlance;

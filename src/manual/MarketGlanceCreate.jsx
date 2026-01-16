/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { postApiData } from "../Services/api";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";

const MarketGlanceCreate = () => {
  const [form, setForm] = useState({
    title: "",
    counters: [{ label: "", value: "" }],
    note: "",
  });

  const addCounter = () =>
    setForm((prev) => ({
      ...prev,
      counters: [...prev.counters, { label: "", value: "" }],
    }));
  const removeCounter = (index) =>
    setForm((prev) => {
      const next = prev.counters.filter((_, i) => i !== index);
      return { ...prev, counters: next.length ? next : [{ label: "", value: "" }] };
    });
  const handleCounterChange = (index, key, value) =>
    setForm((prev) => {
      const next = [...prev.counters];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, counters: next };
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        counters: form.counters
          .filter((c) => c.label && c.value !== "")
          .map((c) => ({ label: c.label, value: Number(c.value) })),
        note: form.note,
      };
      const res = await postApiData("cms/create-market-glance", payload);
      if (res?.success) {
        toast.success("Market Glance created");
        setForm({ title: "", counters: [{ label: "", value: "" }], note: "" });
      } else {
        toast.error(res?.message || "Failed to create");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <>
      <PageHeader />
      <div className="main-content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Create Market at a Glance</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row">
                <div className="col-lg-12 mb-3">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="col-lg-12 mb-2">
                  <label>Counters</label>
                </div>
                {form.counters.map((ctr, idx) => (
                  <div key={idx} className="col-lg-12 mb-2">
                    <div className="row g-2">
                      <div className="col-lg-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Label"
                          value={ctr.label}
                          onChange={(e) => handleCounterChange(idx, "label", e.target.value)}
                        />
                      </div>
                      <div className="col-lg-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Value"
                          value={ctr.value}
                          onChange={(e) => handleCounterChange(idx, "value", e.target.value)}
                        />
                      </div>
                      <div className="col-lg-2">
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
                <div className="col-lg-12 mb-3">
                  <button type="button" className="btn btn-outline-primary" onClick={addCounter}>
                    Add Counter
                  </button>
                </div>
                <div className="col-lg-12 mb-3">
                  <label>Note</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <div className="col-lg-12">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MarketGlanceCreate;

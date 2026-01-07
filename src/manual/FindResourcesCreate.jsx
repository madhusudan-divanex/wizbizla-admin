/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { postApiData } from "../Services/api";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";

const FindResourcesCreate = () => {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    titleLeft: "",
    titleHighlight: "",
    titleRight: "",
    subheading: "",
    bullets: [""],
    note: "",
    ctaText: "",
    ctaLink: "",
    image: null,
    previewImage: null,
  });

  const handleBulletChange = (index, value) => {
    const next = [...form.bullets];
    next[index] = value;
    setForm({ ...form, bullets: next });
  };
  const addBullet = () => setForm({ ...form, bullets: [...form.bullets, ""] });
  const removeBullet = (index) => {
    const next = form.bullets.filter((_, i) => i !== index);
    setForm({ ...form, bullets: next.length ? next : [""] });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP images allowed");
      e.target.value = "";
      return;
    }
    setForm((prev) => ({
      ...prev,
      image: file,
      previewImage: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("titleLeft", form.titleLeft);
    fd.append("titleHighlight", form.titleHighlight);
    fd.append("titleRight", form.titleRight);
    fd.append("subheading", form.subheading);
    fd.append("bullets", JSON.stringify(form.bullets.filter(Boolean)));
    fd.append("note", form.note);
    fd.append("ctaText", form.ctaText);
    fd.append("ctaLink", form.ctaLink);
    if (form.image) fd.append("image", form.image);
    try {
      const res = await postApiData("cms/create-find-resources", fd);
      if (res?.success) {
        toast.success("Find Resources section created");
        setForm({
          titleLeft: "",
          titleHighlight: "",
          titleRight: "",
          subheading: "",
          bullets: [""],
          note: "",
          ctaText: "",
          ctaLink: "",
          image: null,
          previewImage: null,
        });
        if (fileRef.current) fileRef.current.value = "";
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
              <h5 className="mb-0">Create Consumer Free Resources</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row">
                <div className="col-lg-4 mb-3">
                  <label>Title Left</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.titleLeft}
                    onChange={(e) => setForm({ ...form, titleLeft: e.target.value })}
                  />
                </div>
                <div className="col-lg-4 mb-3">
                  <label>Title Highlight</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.titleHighlight}
                    onChange={(e) => setForm({ ...form, titleHighlight: e.target.value })}
                  />
                </div>
                <div className="col-lg-4 mb-3">
                  <label>Title Right</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.titleRight}
                    onChange={(e) => setForm({ ...form, titleRight: e.target.value })}
                  />
                </div>
                <div className="col-lg-12 mb-3">
                  <label>Subheading</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.subheading}
                    onChange={(e) => setForm({ ...form, subheading: e.target.value })}
                  />
                </div>
                <div className="col-lg-12 mb-3">
                  <label>Bullets</label>
                  {form.bullets.map((b, idx) => (
                    <div key={idx} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={b}
                        onChange={(e) => handleBulletChange(idx, e.target.value)}
                      />
                      <button type="button" className="btn btn-outline-danger" onClick={() => removeBullet(idx)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline-primary" onClick={addBullet}>
                    Add Bullet
                  </button>
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Note</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <div className="col-lg-3 mb-3">
                  <label>CTA Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.ctaText}
                    onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                  />
                </div>
                <div className="col-lg-3 mb-3">
                  <label>CTA Link</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.ctaLink}
                    onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                  />
                </div>
                <div className="col-lg-6 mb-3">
                  <label>Image</label>
                  <input type="file" className="form-control" ref={fileRef} onChange={handleFile} />
                </div>
                <div className="col-lg-6 mb-3">
                  {form.previewImage && (
                    <img src={form.previewImage} alt="Preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
                  )}
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

export default FindResourcesCreate;

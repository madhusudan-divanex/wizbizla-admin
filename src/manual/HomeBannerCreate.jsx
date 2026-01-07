/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { postApiData } from "../Services/api";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";

const HomeBannerCreate = () => {
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    smallTitle: "",
    title: "",
    text: "",
    buttonName: "",
    buttonLink: "",
    image: null,
    previewImage: null,
  });

  /* ================= IMAGE HANDLE ================= */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images allowed");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file,
      previewImage: URL.createObjectURL(file),
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.smallTitle || !form.title || !form.text) {
      toast.error("Small Title, Title and Text are required");
      return;
    }

    const fd = new FormData();
    fd.append("smallTitle", form.smallTitle);
    fd.append("title", form.title);
    fd.append("text", form.text);
    fd.append("buttonName", form.buttonName);
    fd.append("buttonLink", form.buttonLink);
    if (form.image) fd.append("image", form.image);

    try {
      const res = await postApiData("cms/create-home-banner", fd);

      if (res?.success) {
        toast.success("Home banner created successfully");

        setForm({
          smallTitle: "",
          title: "",
          text: "",
          buttonName: "",
          buttonLink: "",
          image: null,
          previewImage: null,
        });

        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error(res?.message || "Failed to create banner");
      }
    } catch (error) {
      toast.error("Server error, try again");
    }
  };

  return (
    <>
      <PageHeader />

      <div className="main-content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Create Home Banner</h5>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit} className="row">

                {/* SMALL TITLE */}
                <div className="col-lg-6 mb-3">
                  <label>Small Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.smallTitle}
                    onChange={(e) =>
                      setForm({ ...form, smallTitle: e.target.value })
                    }
                  />
                </div>

                {/* TITLE */}
                <div className="col-lg-6 mb-3">
                  <label>Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                {/* TEXT */}
                <div className="col-lg-12 mb-3">
                  <label>Text *</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={form.text}
                    onChange={(e) =>
                      setForm({ ...form, text: e.target.value })
                    }
                  />
                </div>

                {/* BUTTON NAME */}
                <div className="col-lg-4 mb-3">
                  <label>Button Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.buttonName}
                    onChange={(e) =>
                      setForm({ ...form, buttonName: e.target.value })
                    }
                  />
                </div>

                {/* BUTTON LINK */}
                <div className="col-lg-4 mb-3">
                  <label>Button Link</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.buttonLink}
                    onChange={(e) =>
                      setForm({ ...form, buttonLink: e.target.value })
                    }
                  />
                </div>

                {/* IMAGE */}
                <div className="col-lg-4 mb-3">
                  <label>Image</label>
                  <input
                    type="file"
                    className="form-control"
                    ref={fileRef}
                    onChange={handleFile}
                  />
                </div>

                {/* IMAGE PREVIEW */}
                {form.previewImage && (
                  <div className="col-lg-6 mb-3">
                    <img
                      src={form.previewImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: 220,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                )}

                {/* SUBMIT */}
                <div className="col-lg-12">
                  <button type="submit" className="btn btn-primary">
                    Save Banner
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

export default HomeBannerCreate;

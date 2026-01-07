/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteApiData, getApiData, updateApiData } from "../Services/api";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import base_url from "../baseUrl";

const ExclusiveMemberships = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    titleLeft: "",
    titleHighlight: "",
    titleRight: "",
    subheading: "",
    bullets: [""],
    ctaText: "",
    ctaLink: "",
    image: null,
    previewImage: null,
    scriptTitle: "",
    scriptNote: "",
    scriptCtaText: "",
    scriptCtaLink: "",
    _id: null,
  });

  /* ================= FETCH LIST ================= */
  const fetchList = async () => {
    try {
      const res = await getApiData("cms/get-exclusive-memberships");
      if (res?.success) setSections(res.data || []);
      else toast.error("Exclusive memberships not found");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    }
  };

  /* ================= FETCH BY ID (EDIT MODE) ================= */
  const fetchById = async (sectionId) => {
    try {
      const res = await getApiData(
        `cms/get-exclusive-memberships/${sectionId}`
      );
      if (res?.success) {
        const data = res.data;
        setForm({
          titleLeft: data.titleLeft || "",
          titleHighlight: data.titleHighlight || "",
          titleRight: data.titleRight || "",
          subheading: data.subheading || "",
          bullets: Array.isArray(data.bullets) ? data.bullets : [""],
          ctaText: data.ctaText || "",
          ctaLink: data.ctaLink || "",
          image: null,
          previewImage: data.image ? `${base_url}/${data.image}` : null,
          scriptTitle: data.scriptTitle || "",
          scriptNote: data.scriptNote || "",
          scriptCtaText: data.scriptCtaText || "",
          scriptCtaLink: data.scriptCtaLink || "",
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

  /* ================= BULLETS ================= */
  const addBullet = () =>
    setForm((prev) => ({ ...prev, bullets: [...prev.bullets, ""] }));

  const removeBullet = (index) =>
    setForm((prev) => {
      const next = prev.bullets.filter((_, i) => i !== index);
      return { ...prev, bullets: next.length ? next : [""] };
    });

  /* ================= IMAGE ================= */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({
      ...form,
      image: file,
      previewImage: URL.createObjectURL(file),
    });
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("sectionId", form._id);
      fd.append("titleLeft", form.titleLeft);
      fd.append("titleHighlight", form.titleHighlight);
      fd.append("titleRight", form.titleRight);
      fd.append("subheading", form.subheading);
      fd.append("bullets", JSON.stringify(form.bullets.filter(Boolean)));
      fd.append("ctaText", form.ctaText);
      fd.append("ctaLink", form.ctaLink);
      fd.append("scriptTitle", form.scriptTitle);
      fd.append("scriptNote", form.scriptNote);
      fd.append("scriptCtaText", form.scriptCtaText);
      fd.append("scriptCtaLink", form.scriptCtaLink);
      if (form.image) fd.append("image", form.image);

      const res = await updateApiData(
        "cms/update-exclusive-memberships",
        fd
      );

      if (res?.success) {
        toast.success("Exclusive Membership updated");
        navigate("/cms/exclusive-memberships");
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
        `cms/delete-exclusive-memberships/${deleteId}`
      );
      if (res?.success) {
        toast.success("Deleted");
        fetchList();
      } else toast.error(res?.message || "Delete failed");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageHeader />
      <div className="main-content">
        <div className="container-fluid">

          {/* ================= LIST ================= */}
          {!id && (
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>All Exclusive Memberships</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    navigate("/cms/exclusive-memberships-create")
                  }
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
                      <th>CTA</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.length ? (
                      sections.map((s, i) => (
                        <tr key={s._id}>
                          <td>{i + 1}</td>
                          <td>
                            {`${s.titleLeft || ""} ${s.titleHighlight || ""
                              } ${s.titleRight || ""}`}
                          </td>
                          <td>{s.ctaText}</td>
                          <td>
                            {s.image && (
                              <img
                                src={`${base_url}/${s.image}`}
                                alt=""
                                style={{
                                  height: 40,
                                  width: 80,
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() =>
                                  navigate(
                                    `/cms/exclusive-memberships/${s._id}`
                                  )
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
                        <td colSpan="5" className="text-center">
                          No sections found
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
                <h5>Edit Exclusive Membership</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="row">

                  <div className="col-md-4 mb-3">
                    <label>Title Left</label>
                    <input
                      className="form-control"
                      value={form.titleLeft}
                      onChange={(e) =>
                        setForm({ ...form, titleLeft: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Title Highlight</label>
                    <input
                      className="form-control"
                      value={form.titleHighlight}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          titleHighlight: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Title Right</label>
                    <input
                      className="form-control"
                      value={form.titleRight}
                      onChange={(e) =>
                        setForm({ ...form, titleRight: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label>Subheading</label>
                    <input
                      className="form-control"
                      value={form.subheading}
                      onChange={(e) =>
                        setForm({ ...form, subheading: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label>Bullets</label>
                    {form.bullets.map((b, i) => (
                      <div key={i} className="d-flex gap-2 mb-2">
                        <input
                          className="form-control"
                          value={b}
                          onChange={(e) => {
                            const next = [...form.bullets];
                            next[i] = e.target.value;
                            setForm({ ...form, bullets: next });
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeBullet(i)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={addBullet}
                    >
                      Add Bullet
                    </button>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>CTA Text</label>
                    <input
                      className="form-control"
                      value={form.ctaText}
                      onChange={(e) =>
                        setForm({ ...form, ctaText: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>CTA Link</label>
                    <input
                      className="form-control"
                      value={form.ctaLink}
                      onChange={(e) =>
                        setForm({ ...form, ctaLink: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFile}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    {form.previewImage && (
                      <img
                        src={form.previewImage}
                        alt=""
                        style={{ maxWidth: "100%" }}
                      />
                    )}
                  </div>

                  <div className="col-12 mb-3">
                    <label>Script Title</label>
                    <input
                      className="form-control"
                      value={form.scriptTitle}
                      onChange={(e) =>
                        setForm({ ...form, scriptTitle: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label>Script Note</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={form.scriptNote}
                      onChange={(e) =>
                        setForm({ ...form, scriptNote: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Script CTA Text</label>
                    <input
                      className="form-control"
                      value={form.scriptCtaText}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          scriptCtaText: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Script CTA Link</label>
                    <input
                      className="form-control"
                      value={form.scriptCtaLink}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          scriptCtaLink: e.target.value,
                        })
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
                      onClick={() =>
                        navigate("/cms/exclusive-memberships")
                      }
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

export default ExclusiveMemberships;

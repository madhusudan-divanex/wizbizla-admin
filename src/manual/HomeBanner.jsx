import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getApiData,
  updateApiData,
  deleteApiData,
} from "../Services/api";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import base_url from "../baseUrl";

const HomeBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = new URLSearchParams(location.search).get("edit");

  const [form, setForm] = useState({
    smallTitle: "",
    title: "",
    text: "",
    buttonName: "",
    buttonLink: "",
    image: null,
    previewImage: null,
    _id: null,
  });

  const [banners, setBanners] = useState([]);
  const [banner, setBanner] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  /* ================= FETCH ALL ================= */
  const fetchBanners = async () => {
    try {
      const res = await getApiData("cms/get-home-banners");
      if (res?.success) {
        setBanners(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load banners");
    }
  };

  /* ================= FETCH BY ID ================= */
  const fetchBannerById = async (bannerId) => {
    try {
      const res = await getApiData(`cms/get-home-banner/${bannerId}`);
      if (res?.success) {
        setBanner(res.data || null);
      }
    } catch (error) {
      toast.error("Failed to load banner");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (id) {
      fetchBannerById(id);
    } else {
      fetchBanners();
    }
  }, [id]);

  /* ================= AUTO OPEN EDIT ================= */
  useEffect(() => {
    if (banner && isEditMode) {
      handleEdit(banner);
    }
  }, [banner, isEditMode]);

  /* ================= FILE CHANGE ================= */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      previewImage: URL.createObjectURL(file),
    }));
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setShowEditForm(true);
    setForm({
      smallTitle: item.smallTitle || "",
      title: item.title || "",
      text: item.text || "",
      buttonName: item.buttonName || "",
      buttonLink: item.buttonLink || "",
      image: null,
      previewImage: item.image
        ? `${base_url}/${item.image}`
        : null,
      _id: item._id,
    });
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form._id) return;

    const fd = new FormData();
    fd.append("bannerId", form._id);
    fd.append("smallTitle", form.smallTitle);
    fd.append("title", form.title);
    fd.append("text", form.text);
    fd.append("buttonName", form.buttonName);
    fd.append("buttonLink", form.buttonLink);
    if (form.image) fd.append("image", form.image);

    try {
      const res = await updateApiData("cms/update-home-banner", fd);
      if (res?.success) {
        toast.success("Banner updated");
        setShowEditForm(false);
        navigate("/cms/home-banner");
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (bannerId) => {
    try {
      const res = await deleteApiData(
        `cms/delete-home-banner/${bannerId}`
      );
      if (res?.success) {
        toast.success("Banner deleted");
        navigate("/cms/home-banner");
      }
    } catch (error) {
      toast.error("Delete failed");
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
              <div className="card-header">
                <h5>All Home Banners</h5>
              </div>
              <div className="card-body table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Button</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.length ? (
                      banners.map((b, i) => (
                        <tr key={b._id}>
                          <td>{i + 1}</td>
                          <td>{b.title}</td>
                          <td>{b.buttonName}</td>
                          <td>
                            {b.image && (
                              <img
                                src={`${base_url}/${b.image}`}
                                alt=""
                                style={{
                                  width: 80,
                                  height: 40,
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
                                    `/cms/home-banner/${b._id}?edit=true`
                                  )
                                }
                              >
                                Open
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(b._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center"
                        >
                          No banners found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= EDIT FORM ================= */}
          {showEditForm && (
            <div className="card mt-4">
              <div className="card-header">
                <h5>Update Home Banner</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="row">

                  <div className="col-lg-6 mb-3">
                    <label>Small Title</label>
                    <input
                      className="form-control"
                      value={form.smallTitle}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          smallTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label>Title</label>
                    <input
                      className="form-control"
                      value={form.title}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-lg-12 mb-3">
                    <label>Text</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={form.text}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          text: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label>Button Name</label>
                    <input
                      className="form-control"
                      value={form.buttonName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          buttonName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label>Button Link</label>
                    <input
                      className="form-control"
                      value={form.buttonLink}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          buttonLink: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label>Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFile}
                    />
                  </div>

                  <div className="col-lg-6 mb-3">
                    {form.previewImage && (
                      <img
                        src={form.previewImage}
                        alt=""
                        style={{
                          maxWidth: "100%",
                          borderRadius: 8,
                        }}
                      />
                    )}
                  </div>

                  <div className="col-lg-12 d-flex gap-2">
                    <button className="btn btn-primary">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowEditForm(false);
                        navigate("/cms/home-banner");
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
  );
};

export default HomeBanner;
